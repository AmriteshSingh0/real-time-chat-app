import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL= import.meta.env.MODE=== "development" ?  "http://localhost:5002" : "/"

const useAuthStore = create((set,get) => ({
    authUser:null,
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth: false,
    onlineUsers:[],
    socket:null,
    
    
   checkAuth:async()=>{
     try{
     const res=await axiosInstance.get("/auth/check");
     set({authUser:res.data})
     get().connectSocket();
     } catch(error){
        console.log(error);
        set({authUser:null})
     }finally{
        set({isCheckingAuth:false})
     }

     },
    signup:async(data)=>{
      set({isSigningUp:true});
      try{
         
         const res=await axiosInstance.post("/auth/signup",data);
         set({authUser:res.data});
         toast.success("Account created successfully")
         get().connectSocket();
       }
       catch (error) {
        console.log("Signup error:", error);  // Add this to see what error object looks like
        const errorMessage = error?.response?.data?.message || "Something went wrong! Please try again.";
        toast.error(errorMessage);
     if (error.response) {
       console.error("Error response:", error.response);
        }

        throw error; 
   } finally {
     set({isSigningUp:false});
   }
     },
   logout:async()=>{
       try{
       await axiosInstance.post("/auth/logout");
       set({authUser:null});
       toast.success("Logged out successfully");
       get().disconnectSocket();
      }catch(error){ 
         console.log("Logout error:", error);
         const errorMessage = error?.response?.data?.message || "Something went wrong! Please try again.";
         toast.error(errorMessage);

      }
    },
   login:async(data)=>{
      set({isLoggingIn:true});
      try{
         const res=await axiosInstance.post("/auth/login",data);
         set({authUser:res.data});
         toast.success("loggned in successfully")
         get().connectSocket();
         }catch(error){
         console.log("Login error:", error);
         const errorMessage = error?.response?.data?.message || "Something went wrong! Please try again.";
         toast.error(errorMessage);

      }finally{
         set({ isLoggingIn: false })

      }
   },
   updateProfile: async (data) => {
      set({ isUpdatingProfile: true });
      try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      } catch (error) {
        console.log("error in update profile:", error);
        toast.error(error.response.data.message);
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    connectSocket:()=>{
     const {authUser}=get()
     if(!authUser || get().socket?.connected) return;

     

      const socket=io(BASE_URL ,{
        withCredentials: true,
        query:{
          userId:authUser._id,
        },
      })
      socket.connect()

      set({socket:socket})
      socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
    },
    disconnectSocket:()=>{
       if(get().socket?.connected)  get().socket.disconnect();
        },



}));

export default useAuthStore;