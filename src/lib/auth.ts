import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from "next-auth";
import bcrypt from 'bcryptjs';
import {z} from "zod";

import { prisma } from './prisma';
import { logger } from './logger';

const credentialSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials:{
            email: {label: "Email", type: "email"},
            password: {label: "Password", type: "password"},
        },

        async authorize(credential){
            const parsed = credentialSchema.safeParse(credential);

            if(!parsed.success){
                return null;
            }

            const {email, password} = parsed.data;

            const normalizedEmail = email.toLowerCase().trim();

            const admin = await prisma.admin.findUnique({
                where: {
                    email_id: normalizedEmail
                }
            })

            if(!admin || !admin.is_active){
                logger.warn("Admin authentication failed", {
                    reason: "invalid_or_inactive account"
                })
                return null;
            }

            const passwordValid = await bcrypt.compare(password, admin.password)

            if(!passwordValid){
                logger.warn("Admin authentication failed", {
                    reason: "invalid_credentials"
                })
                return null;
            }

            return {
                id: admin.id.toString(),
                email: admin.email_id,
                name: admin.full_name,
                image: admin.profile_image,
            }
        }
    })
  ],


  callbacks: {
    async jwt({ token, user }){
        if(user){
            token.id = user.id
        }
        return token;
    },

    async session({session, token}){
        if(session.user && token.id){
            session.user.id = token.id as string;
        }
        return session
    }
  },

  secret: process.env.NEXTAUTH_SECRET
};
