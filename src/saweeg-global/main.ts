import "../styles/main.css";
import "./world.css";
import "./v1.css";
import {mountWorldInteractions} from "./controller.ts";
// Content is rendered at build time. No review package or religious meaning enters this bundle.
const root=document.querySelector<HTMLElement>('.swg-world[data-release="v1"]');
if(root)mountWorldInteractions(root);
