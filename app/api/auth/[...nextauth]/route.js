import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import mongoose from "mongoose";
import User from "@/models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      
      console.log("user: ", user);
      
      try {
        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.MONGO_URI);
          console.log("The connection was established")
        }
        if (account.provider == "google") {
          console.log("Working with db")
          const currentUser = await User.findOne({
            authProvider: "google",
            googleId: user.id,
          });
          if (!currentUser) {
            console.log("the user wasn't found ");
            const useremail = profile.email || user.email || email;
            const newUser = new User({
              email: useremail,
              name: profile.name,
              googleId: user.id,
              authProvider: "google",
              profilePic: user.image,
            });
            await newUser.save();
            console.log("The user was saved")
            return true;
          } else if (currentUser) {
            return true;
          }
        } else if (account.provider == "credentials") {
          const currentUser = await User.findOne({
            email: profile.email,
            authProvider: "local",
          });
          if (!currentUser) {
            return "/login";
          }
        }
      } catch (error) {
        console.log("Mongoose connection error message: ", error.message);
        return false;
      }
    },
    async session({session,user}){
      if(mongoose.connection.readyState!==1){
        await mongoose.connect(process.env.MONGO_URI);
        console.log("The connection was established")
      }
      const currentUser=await User.findOne({
        email:session.user.email
      })
      session.user.id=currentUser.id.toString();
      session.user.profilePic=currentUser.profilePic;
      session.user.coverPic=currentUser.coverPic;
      session.user.tagLine=currentUser.tagline;
      session.user.handle=currentUser.handle;
      session.user.name=currentUser.name;
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/profile`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // Optional but recommended
});

export { handler as GET, handler as POST };
