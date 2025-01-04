import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import mongoClientPromise from "./database/mongoClientPromise";
import { userModel } from "./model/user-model";
import { dbConnect } from "./service/mongo";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: MongoDBAdapter(mongoClientPromise, {databaseName: process.env.MONGODB_CONNECTION_STRING }),
    session: {
        strategy:'jwt',
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {
                if (credentials == null) return null;
                await dbConnect();

                try {
                    const user = await userModel.findOne({email:credentials.email});
                    if (user) {
                        const isMatch = await bcrypt.compare(
                            credentials.password,
                            user.password
                        );

                        if(isMatch) {
                            return user
                        } else {
                            throw new Error('Email or password mismatch');
                        }
                    } else {
                        throw new Error('User not found');
                    }
                } catch(error) {
                    throw new Error(error);
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // console.log("token", user)
            // Pass user information to the token if available
            if (user) {
                token.user = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    mobile: user.mobile,
                    slag: user.slag,
                    permissions: user.permission

                };
            }
            return token;
        },

        async session({ session, token ,user}) {
            session.user = token.user
            // console.log(`Returning Session ${JSON.stringify(session)}`)
            return session;
          },
      }
})