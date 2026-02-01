import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { comparePassword } from "../security/encryption";
import { verifyAge } from "../validators/age-verification";
import { createAuditLog } from "../security/audit";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-email",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const remainingTime = Math.ceil(
            (user.lockedUntil.getTime() - Date.now()) / 60000
          );
          throw new Error(
            `Account locked. Try again in ${remainingTime} minutes.`
          );
        }

        // Check if banned
        if (user.isBanned) {
          throw new Error("Account has been banned");
        }

        // Verify password
        const isValid = await comparePassword(
          credentials.password,
          user.hashedPassword
        );

        if (!isValid) {
          // Increment failed login attempts
          const failedAttempts = user.failedLoginAttempts + 1;
          const updates: any = {
            failedLoginAttempts: failedAttempts,
          };

          // Lock account after 5 failed attempts
          if (failedAttempts >= 5) {
            updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
          }

          await prisma.user.update({
            where: { id: user.id },
            data: updates,
          });

          throw new Error("Invalid credentials");
        }

        // Check email verification
        if (!user.emailVerified) {
          throw new Error("Please verify your email address");
        }

        // Check age verification
        if (!user.ageVerified) {
          throw new Error("Age verification required");
        }

        // Check if terms accepted
        if (!user.termsAccepted || !user.privacyPolicyAccepted) {
          throw new Error("Please accept Terms of Service and Privacy Policy");
        }

        // Get IP address
        const ipAddress =
          req.headers?.["x-forwarded-for"] || 
          req.headers?.["x-real-ip"] || 
          "unknown";

        // Reset failed attempts and update last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lastLoginAt: new Date(),
            lastLoginIp: ipAddress as string,
            lockedUntil: null,
          },
        });

        // Create audit log
        await createAuditLog({
          userId: user.id,
          action: "login",
          ipAddress: ipAddress as string,
          userAgent: req.headers?.["user-agent"] || "unknown",
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          ageVerified: user.ageVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.ageVerified = (user as any).ageVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).ageVerified = token.ageVerified;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        await createAuditLog({
          userId: token.id as string,
          action: "logout",
        });
      }
    },
  },
};

// Helper to get current user server-side
export async function getCurrentUser() {
  const { getServerSession } = await import("next-auth");
  const session = await getServerSession(authOptions);
  return session?.user;
}

// Helper to require authentication
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

// Helper to check if user is verified
export async function requireVerifiedUser() {
  const user = await requireAuth();
  
  const dbUser = await prisma.user.findUnique({
    where: { id: (user as any).id },
    select: {
      ageVerified: true,
      emailVerified: true,
      isBanned: true,
      isActive: true,
    },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  if (dbUser.isBanned) {
    throw new Error("Account has been banned");
  }

  if (!dbUser.isActive) {
    throw new Error("Account is not active");
  }

  if (!dbUser.emailVerified) {
    throw new Error("Email verification required");
  }

  if (!dbUser.ageVerified) {
    throw new Error("Age verification required");
  }

  return user;
}
