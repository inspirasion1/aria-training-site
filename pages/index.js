import Head from "next/head"
import { useState, useRef, useEffect } from "react"
const FB_GROUP = "https://www.facebook.com/groups/ariatraininginitiative"
const CHIPS = ["What will ARIA eventually do?","How does my conversation help?","Tell me about the subsidiaries","What is the holding company model?"]
function genSession() { return Math.random().toString(36).slice(2) + Date.now().toString(36) }
export default function Home() {
  const [msgs, setMsgs] = useState([{ role:"assistant", content:"I'm ARIA — an AI being trained by the Young's Multimedia Holdings community. Everything you say here goes into building me. What do you want to talk about?" }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [chips, setChips] = useState(true)
  const [session] = useState(genSession)
  const [stats, setStats] = useState({ total:0, approved:0, todayCount:0, contributors:0 })
  const msgsRef = useRef(null)
  const taRef = useRef(null)
  useEffect(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight }, [msgs, loading])
  useEffect(() => { fetch("/api/stats").then(r=>r.json()).then(d=>{ if(d&&!d.error) setStats(d) }).catch(console.error) }, [])
  async function send(text) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setChips(false)
    setInput("")
    if (taRef.current) taRef.current.style.height = "auto"
    const next = [...msgs, { role:"user", content:msg }]
    setMsgs(next)
    setLoading(true)
    try {
      const res = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ messages:next.map(m=>({ role:m.role, content:m.content })) }) })
      const data = await res.json()
      const reply = data.reply || "Try again."
      setMsgs(prev => [...prev, { role:"assistant", content:reply }])
      fetch("/api/log", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ userMessage:msg, ariResponse:reply, sessionId:session }) }).then(()=>{ fetch("/api/stats").then(r=>r.json()).then(d=>{ if(d&&!d.error) setStats(d) }).catch(console.error) }).catch(console.error)
    } catch(e) {
      setMsgs(prev => [...prev, { role:"assistant", content:"Connection issue. Try again." }])
    } finally { setLoading(false) }
  }
  function onKey(e) { if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send() } }
  function onInput(e) { setInput(e.target.value); e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,120)+"px" }
  return (
    <>
      <Head>
        <title>YMMH — Train ARIA</title>
        <meta name="description" content="Help train an intelligence from the ground up. Young's Multimedia Holdings community training initiative." />
      </Head>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",background:"#F8F5EF"}}>
        {/* NAV */}
        <nav style={{height:56,background:"rgba(248,245,239,0.95)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(12,26,46,0.09)",display:"flex",alignItems:"center",padding:"0 2rem",justifyContent:"space-between",flexShrink:0}}>
          <a href="#" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none"}}>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"#0C1A2E",letterSpacing:"-0.02em",lineHeight:1}}>Y<span style={{color:"#8B6914"}}>M</span>H</span>
            <span style={{width:1,height:20,background:"#E2DAC8",display:"block"}}></span>
            <span style={{fontSize:10,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:"#475569",lineHeight:1.4}}>Young&apos;s Multimedia<br/>Holdings LLC</span>
          </a>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#475569"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#2D9B6F",display:"inline-block",animation:"breathe 2.5s ease-in-out infinite"}}></span>
              Training active
            </div>
            <a href={FB_GROUP} target="_blank" rel="noopener noreferrer" style={{fontSize:11,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:"#0C1A2E",border:"1px solid #0C1A2E",borderRadius:4,padding:"6px 14px",textDecoration:"none"}}>Join community</a>
          </div>
        </nav>
        {/* BODY */}
        <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 420px",gap:0,overflow:"hidden",maxWidth:1200,margin:"0 auto",width:"100%",padding:"1.5rem 2rem"}}>
          {/* LEFT — title + stats */}
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",paddingRight:"3rem",gap:"1.5rem"}}>
            <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:"#8B6914",display:"flex",alignItems:"center",gap:8}}>
              <span style={{display:"block",width:20,height:1,background:"#C9A84C"}}></span>
              Community Training Initiative
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.5rem,4vw,4rem)",fontWeight:500,lineHeight:1.05,color:"#0C1A2E",letterSpacing:"-0.01em"}}>
              Help build an<br/><em style={{fontStyle:"italic",color:"#8B6914"}}>intelligence</em><br/>from scratch
            </h1>
            <p style={{fontSize:15,lineHeight:1.7,color:"#475569",maxWidth:400}}>
              Young&apos;s Multimedia Holdings is training ARIA — a proprietary AI serving our entire portfolio. Every conversation you have here will be used to train her.
            </p>
            <div style={{display:"flex",gap:10,padding:"14px 16px",background:"#fff",border:"1px solid rgba(12,26,46,0.09)",borderLeft:"3px solid #C9A84C",borderRadius:6,fontSize:13,color:"#475569",lineHeight:1.6}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#8B6914",flexShrink:0,fontWeight:600}}>—</span>
              <span>No ambiguity: your conversations will be used to train AI. No personal data stored beyond your messages.</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {v:stats.total.toLocaleString(), l:"conversations"},
                {v:stats.approved.toLocaleString(), l:"approved pairs"},
                {v:stats.todayCount.toLocaleString(), l:"chats today"},
                {v:stats.contributors.toLocaleString(), l:"contributors"},
              ].map((x,i)=>(
                <div key={i} style={{background:"#0C1A2E",borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",fontWeight:500,color:"#E0C068",lineHeight:1,marginBottom:3}}>{x.v||"0"}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",letterSpacing:"0.04em"}}>{x.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* RIGHT — chat */}
          <div style={{display:"flex",flexDirection:"column",background:"#fff",border:"1px solid rgba(12,26,46,0.09)",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 20px rgba(12,26,46,0.05)"}}>
            {/* chat header */}
            <div style={{padding:"1rem 1.25rem",borderBottom:"1px solid rgba(12,26,46,0.09)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"#0C1A2E",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",flexShrink:0}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",color:"#C9A84C",fontSize:16,lineHeight:1}}>A</span>
                  <div style={{position:"absolute",bottom:0,right:0,width:9,height:9,borderRadius:"50%",background:"#2D9B6F",border:"2px solid white"}}></div>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:500,color:"#0C1A2E"}}>ARIA <span style={{fontWeight:300,color:"#94A3B8",fontSize:12}}>— training persona</span></div>
                  <div style={{fontSize:11,color:"#94A3B8"}}>Conversations reviewed, then used for training</div>
                </div>
              </div>
              <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",color:"#8B6914",background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.25)",borderRadius:4,padding:"4px 8px"}}>In training</div>
            </div>
            {/* messages */}
            <div ref={msgsRef} style={{flex:1,overflowY:"auto",padding:"1.25rem",display:"flex",flexDirection:"column",gap:14,minHeight:0}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:"flex",gap:8,flexDirection:m.role==="user"?"row-reverse":"row"}}>
                  {m.role==="assistant"
                    ? <div style={{width:26,height:26,borderRadius:"50%",background:"#0C1A2E",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",color:"#C9A84C",fontSize:12}}>A</span></div>
                    : <div style={{width:26,height:26,borderRadius:"50%",background:"#EEE9DF",border:"1px solid #E2DAC8",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,fontSize:8,color:"#94A3B8",fontWeight:500,letterSpacing:"0.06em"}}>YOU</div>
                  }
                  <div style={{maxWidth:"80%"}}>
                    <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:"#94A3B8",marginBottom:4,textAlign:m.role==="user"?"right":"left"}}>{m.role==="assistant"?"ARIA":"You"}</div>
                    <div style={{padding:"10px 14px",borderRadius:12,fontSize:13,lineHeight:1.65,whiteSpace:"pre-wrap",...(m.role==="assistant"?{background:"#F8F5EF",color:"#0C1A2E",border:"1px solid rgba(12,26,46,0.09)",borderBottomLeftRadius:3}:{background:"#0C1A2E",color:"rgba(255,255,255,0.92)",borderBottomRightRadius:3})}}>{m.content}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{display:"flex",gap:8}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:"#0C1A2E",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",color:"#C9A84C",fontSize:12}}>A</span></div>
                  <div>
                    <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:"#94A3B8",marginBottom:4}}>ARIA</div>
                    <div style={{display:"flex",gap:4,alignItems:"center",padding:"10px 14px",background:"#F8F5EF",border:"1px solid rgba(12,26,46,0.09)",borderRadius:12,borderBottomLeftRadius:3,width:"fit-content"}}>
                      {[0,0.2,0.4].map((d,i)=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"#94A3B8",animation:`tdot 1.3s ease-in-out ${d}s infinite`}}></div>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* chips */}
            {chips && (
              <div style={{display:"flex",flexWrap:"wrap",gap:6,padding:"0 1.25rem 0.75rem",flexShrink:0}}>
                {CHIPS.map((c,i)=>(
                  <button key={i} onClick={()=>send(c)} style={{fontFamily:"'Jost',sans-serif",fontSize:11,color:"#475569",background:"#F8F5EF",border:"1px solid rgba(12,26,46,0.09)",borderRadius:20,padding:"4px 11px",cursor:"pointer"}}>{c}</button>
                ))}
              </div>
            )}
            {/* input */}
            <div style={{borderTop:"1px solid rgba(12,26,46,0.09)",padding:"1rem 1.25rem",flexShrink:0,background:"#fff"}}>
              <div style={{display:"flex",gap:8,alignItems:"flex-end",background:"#F8F5EF",border:"1px solid #E2DAC8",borderRadius:10,padding:"8px 8px 8px 14px"}}>
                <textarea ref={taRef} value={input} onChange={onInput} onKeyDown={onKey}
                  style={{flex:1,border:"none",background:"transparent",fontFamily:"'Jost',sans-serif",fontSize:13,color:"#0C1A2E",resize:"none",outline:"none",minHeight:20,maxHeight:120,lineHeight:1.5}}
                  placeholder="Talk to ARIA — your conversation will be used to train her..." rows={1} maxLength={20000} />
                <button onClick={()=>send()} disabled={loading||!input.trim()} style={{width:32,height:32,borderRadius:7,background:"#0C1A2E",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="#C9A84C"><path d="M1 1l12 6-12 6V8.5l8.5-1.5L1 5.5V1z"/></svg>
                </button>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                <span style={{fontSize:11,color:"#94A3B8"}}>Your conversation will be used to train AI.</span>
                <span style={{fontSize:11,color:"#94A3B8"}}>{input.length.toLocaleString()} / 20,000</span>
              </div>
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <div style={{borderTop:"1px solid rgba(12,26,46,0.09)",padding:"0.75rem 2rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:600,color:"#0C1A2E"}}>Y<span style={{color:"#8B6914"}}>M</span>H</span>
          <div style={{display:"flex",gap:20}}>
            {["Privacy","Terms","Training policy"].map((l,i)=><a key={i} href="#" style={{fontSize:11,color:"#94A3B8",textDecoration:"none"}}>{l}</a>)}
            <a href={FB_GROUP} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#8B6914",textDecoration:"none",fontWeight:500}}>Join community →</a>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes breathe { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.75)} }
        @keyframes tdot { 0%,60%,100%{transform:translateY(0);opacity:.35} 30%{transform:translateY(-4px);opacity:1} }
        textarea:focus{outline:none} button:disabled{opacity:.5;cursor:not-allowed}
        *{box-sizing:border-box}
      `}</style>
    </>
  )
}