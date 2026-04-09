import {create} from "zustand";
import { IGlobalStore } from "./interface";


export const useGlobalStore = create<IGlobalStore>((set)=>({

    activeUrl:"dashboard",
    setActiveUrl:(url:string)=>set({activeUrl:url}),

    started:false,
    setStarted:(started:boolean)=>set({started}),

    expanded:false,
    setExpanded:(expanded:boolean)=>set({expanded}),

}))