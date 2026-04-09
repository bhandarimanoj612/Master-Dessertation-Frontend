import  {create} from "zustand";
import { IStatCardStore } from "./interface";


export const  useStatCardStore =create<IStatCardStore>((set)=>({
  isVisible:false,
  setIsVisible:(isVisible:boolean)=>set({isVisible}),
}))

