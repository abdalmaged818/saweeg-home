// Scoped lifecycle: no global locale persistence, routing, analytics or public activation.
export function mountWorldInteractions(root: HTMLElement): () => void {
  const abort = new AbortController();
  const options = {signal:abort.signal};
  const button=root.querySelector<HTMLButtonElement>("[data-menu-button]");
  const panel=root.querySelector<HTMLElement>("[data-mobile-navigation]");
  const desktop=matchMedia("(min-width:900px)");
  const reduced=matchMedia("(prefers-reduced-motion:reduce)");
  function setMenu(open:boolean,returnFocus=false) {
    if(!button || !panel) return;
    document.body.classList.toggle("menu-open",open);
    panel.hidden=!open;button.setAttribute("aria-expanded",String(open));
    button.setAttribute("aria-label",(open?button.dataset.closeLabel:button.dataset.openLabel)!);
    if(open)panel.querySelector<HTMLAnchorElement>("a")?.focus();
    else if(returnFocus)button.focus();
  }
  button?.addEventListener("click",()=>setMenu(button.getAttribute("aria-expanded")!=="true"),options);
  root.addEventListener("keydown",event=>{if(event.key==="Escape"&&panel&&!panel.hidden)setMenu(false,true);},options);
  desktop.addEventListener("change",event=>{if(event.matches)setMenu(false);},options);
  root.addEventListener("click",event=>{
    const header=root.querySelector("[data-site-header]");
    if(panel&&!panel.hidden&&event.target instanceof Node&&!header?.contains(event.target))setMenu(false);
    const element=(event.target as Element).closest<HTMLElement>("a,button");
    if(!element)return;
    if(element.hasAttribute("data-world-disclosure")) {
      const box=root.querySelector<HTMLElement>(`#${element.getAttribute("aria-controls")}`);
      if(box){box.hidden=!box.hidden;element.setAttribute("aria-expanded",String(!box.hidden));}return;
    }
    const href=element.getAttribute("href");
    if(!href?.startsWith("#world-"))return;
    const target=root.querySelector<HTMLElement>(href);
    if(!target)return;
    event.preventDefault();setMenu(false);
    if(href==="#world-top") {window.scrollTo({top:0,behavior:reduced.matches?"instant":"smooth"});root.querySelector<HTMLAnchorElement>(".brand")?.focus({preventScroll:true});return;}
    target.scrollIntoView({behavior:reduced.matches?"instant":"smooth"});
    const focus=target.matches("main")?target:target.querySelector<HTMLElement>("h2,h1");
    focus?.focus({preventScroll:true});
  },options);
  function syncNavigation(){
    let current="";
    for(const section of root.querySelectorAll<HTMLElement>("main section[id]"))if(section.getBoundingClientRect().top<=140)current=`#${section.id}`;
    root.querySelectorAll(".desktop-nav a,.mobile-navigation a").forEach(anchor=>{if(anchor.getAttribute("href")===current)anchor.setAttribute("aria-current","true");else anchor.removeAttribute("aria-current");});
  }
  window.addEventListener("scroll",syncNavigation,{...options,passive:true});
  return ()=>{setMenu(false);abort.abort();};
}
