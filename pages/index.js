import Head from "next/head"
import { useState, useRef, useEffect } from "react"
const FB_GROUP = "https://www.facebook.com/groups/ariatraininginitiative"
const CHIPS = [
  "What will ARIA eventually do?",
  "How does my conversation help?",
  "Tell me about the subsidiaries",
  "What is the holding company model?",
]
function genSession() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
export default function Home() {
  const [msgs, setMsgs] = useState([{
    role: "assistant",
    content: "I'm ARIA — an AI being trained by the Young's Multimedia Holdings community. Everything you say here goes into building me. What do you want to talk about?"
  }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [chips, setChips] = useState(true)
  const [session] = useState(genSession)
  const [stats, setStats] = useState({ total: 0, approved: 0, todayCount: 0, contributors: 0 })
  const msgsRef = useRef(null)
  const taRef = useRef(null)
  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [msgs, loading])
  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(data => {
      if (data && !data.error) setStats(data)
    }).catch(console.error)
  }, [])
  async function send(text) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setChips(false)
    setInput("")
    if (taRef.current) taRef.current.style.height = "auto"
    const next = [...msgs, { role: "user", content: msg }]
    setMsgs(next)
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })) })
      })
      const data = await res.json()
      const reply = data.reply || "Try again."
      setMsgs(prev => [...prev, { role: "assistant", content: reply }])
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: msg, ariResponse: reply, sessionId: session })
      }).then(() => {
        fetch("/api/stats").then(r => r.json()).then(data => {
          if (data && !data.error) setStats(data)
        }).catch(console.error)
      }).catch(console.error)
    } catch (e) {
      setMsgs(prev => [...prev, { role: "assistant", content: "Connection issue. Try again." }])
    } finally {
      setLoading(false)
    }
  }
  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }
  function onInput(e) {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px"
  }
  const s = {
    nav: { position:"fixed", top:0, left:0, right:0, zIndex:200, height:64, background:"rgba(248,245,239,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(12,26,46,0.09)", display:"flex", alignItems:"center", padding:"0 2.5rem", justifyContent:"space-between" },
    brand: { display:"flex", alignItems:"center", gap:14, textDecoration:"none" },
    mono: { fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600, color:"#0C1A2E", letterSpacing:"-0.02em", lineHeight:1 },
    div: { width:1, height:22, background:"#E2DAC8" },
    btext: { fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#475569", lineHeight:1.4 },
    nr: { display:"flex", alignItems:"center", gap:24 },
    nstat: { display:"flex", alignItems:"center", gap:7, fontSize:12, color:"#475569" },
    dot: { width:7, height:7, borderRadius:"50%", background:"#2D9B6F", display:"inline-block", animation:"breathe 2.5s ease-in-out infinite" },
    ncta: { fontSize:12, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:"#0C1A2E", background:"none", border:"1px solid #0C1A2E", borderRadius:4, padding:"7px 18px", cursor:"pointer", textDecoration:"none" },
    hero: { padding:"120px 2.5rem 0", maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5rem", alignItems:"center", minHeight:"90vh" },
    tag: { display:"inline-flex", alignItems:"center", gap:8, fontSize:10, fontWeight:500, letterSpacing:"0.14em", textTransform:"uppercase", color:"#8B6914", marginBottom:"1.75rem" },
    tagline: { display:"block", width:24, height:1, background:"#C9A84C" },
    title: { fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(3rem,5.5vw,5rem)", fontWeight:500, lineHeight:1.05, color:"#0C1A2E", letterSpacing:"-0.01em", marginBottom:"1.5rem" },
    body: { fontSize:16, lineHeight:1.75, color:"#475569", maxWidth:440, marginBottom:"2.5rem" },
    notice: { display:"flex", gap:14, padding:"18px 20px", background:"#fff", border:"1px solid rgba(12,26,46,0.09)", borderLeft:"3px solid #C9A84C", borderRadius:6, fontSize:13, color:"#475569", lineHeight:1.6, maxWidth:460 },
    nmark: { fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:"#8B6914", flexShrink:0, lineHeight:1.2, fontWeight:600 },
    sc: { background:"#0C1A2E", borderRadius:16, padding:"2.5rem", color:"white", position:"relative", overflow:"hidden" },
    scey: { fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#C9A84C", marginBottom:"1.25rem" },
    sch: { fontFamily:"'Cormorant Garamond',serif", fontSize:"1.6rem", fontWeight:500, lineHeight:1.25, color:"rgba(255,255,255,0.92)", marginBottom:"2rem" },
    scg: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:"1.75rem" },
    scs: { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"14px 16px" },
    scv: { fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:500, color:"#E0C068", lineHeight:1, marginBottom:4 },
    scl: { fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:"0.04em" },
    scpr: { display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8 },
    scbar: { height:3, background:"rgba(255,255,255,0.08)", borderRadius:2, overflow:"hidden" },
    scfill: { height:"100%", background:"linear-gradient(90deg,#8B6914,#E0C068)", borderRadius:2, width:"41%" },
    divider: { maxWidth:1200, margin:"4rem auto 0", padding:"0 2.5rem", display:"flex", alignItems:"center", gap:"1rem" },
    dline: { flex:1, height:1, background:"#E2DAC8" },
    dtext: { fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#94A3B8" },
    layout: { maxWidth:1200, margin:"2.5rem auto 0", padding:"0 2.5rem 5rem", display:"grid", gridTemplateColumns:"1fr 320px", gap:"1.5rem", alignItems:"start" },
    chat: { background:"#fff", border:"1px solid rgba(12,26,46,0.09)", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 20px rgba(12,26,46,0.05)" },
    ctop: { padding:"1.25rem 1.5rem", borderBottom:"1px solid rgba(12,26,46,0.09)", display:"flex", alignItems:"center", justifyContent:"space-between" },
    ar: { display:"flex", alignItems:"center", gap:12 },
    aorb: { width:40, height:40, borderRadius:"50%", background:"#0C1A2E", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", flexShrink:0 },
    aorl: { fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:"#C9A84C", fontSize:18, lineHeight:1 },
    alive: { position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:"50%", background:"#2D9B6F", border:"2px solid white" },
    aname: { fontSize:14, fontWeight:500, color:"#0C1A2E" },
    ameta: { fontSize:11, color:"#94A3B8" },
    tflag: { fontSize:10, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:"#8B6914", background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.25)", borderRadius:4, padding:"5px 10px" },
    msgs: { padding:"1.5rem", minHeight:420, maxHeight:500, overflowY:"auto", display:"flex", flexDirection:"column", gap:18 },
    msgWrap: { display:"flex", gap:10 },
    msgWrapU: { display:"flex", gap:10, flexDirection:"row-reverse" },
    morb: { width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", marginTop:3 },
    morbl: { fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:"#C9A84C", fontSize:13 },
    mbody: { maxWidth:"78%" },
    mname: { fontSize:10, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:"#94A3B8", marginBottom:6 },
    mnamer: { fontSize:10, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:"#94A3B8", marginBottom:6, textAlign:"right" },
    bai: { padding:"12px 16px", borderRadius:14, fontSize:14, lineHeight:1.65, background:"#F8F5EF", color:"#0C1A2E", border:"1px solid rgba(12,26,46,0.09)", borderBottomLeftRadius:4, whiteSpace:"pre-wrap" },
    bu: { padding:"12px 16px", borderRadius:14, fontSize:14, lineHeight:1.65, background:"#0C1A2E", color:"rgba(255,255,255,0.92)", borderBottomRightRadius:4, whiteSpace:"pre-wrap" },
    tw: { display:"flex", gap:5, alignItems:"center", padding:"13px 16px", background:"#F8F5EF", border:"1px solid rgba(12,26,46,0.09)", borderRadius:14, borderBottomLeftRadius:4, width:"fit-content" },
    td: { width:5, height:5, borderRadius:"50%", background:"#94A3B8" },
    chips: { display:"flex", flexWrap:"wrap", gap:7, padding:"0 1.5rem 1rem" },
    chip: { fontFamily:"'Jost',sans-serif", fontSize:12, color:"#475569", background:"#F8F5EF", border:"1px solid rgba(12,26,46,0.09)", borderRadius:20, padding:"5px 13px", cursor:"pointer" },
    cfoot: { borderTop:"1px solid rgba(12,26,46,0.09)", padding:"1.25rem 1.5rem", background:"#fff" },
    iw: { display:"flex", gap:10, alignItems:"flex-end", background:"#F8F5EF", border:"1px solid #E2DAC8", borderRadius:12, padding:"10px 10px 10px 16px" },
    mta: { flex:1, border:"none", background:"transparent", fontFamily:"'Jost',sans-serif", fontSize:14, color:"#0C1A2E", resize:"none", outline:"none", minHeight:22, maxHeight:140, lineHeight:1.5 },
    sbtn: { width:36, height:36, borderRadius:8, background:"#0C1A2E", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
    fm: { display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:10 },
    fn: { fontSize:11, color:"#94A3B8", lineHeight:1.4 },
    cc: { fontSize:11, color:"#94A3B8" },
    sb: { display:"flex", flexDirection:"column", gap:"1rem" },
    scard: { background:"#fff", border:"1px solid rgba(12,26,46,0.09)", borderRadius:14, padding:"1.25rem" },
    sh4: { fontSize:10, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#94A3B8", marginBottom:"1rem" },
    slr: { display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"8px 0", borderBottom:"1px solid rgba(12,26,46,0.09)", fontSize:13 },
    slk: { color:"#475569" },
    slv: { fontWeight:500, color:"#0C1A2E" },
    pw: { marginTop:10 },
    pl: { display:"flex", justifyContent:"space-between", fontSize:11, color:"#94A3B8", marginBottom:6 },
    pt: { height:3, background:"#EEE9DF", borderRadius:2, overflow:"hidden" },
    pf: { height:"100%", background:"linear-gradient(90deg,#8B6914,#E0C068)", borderRadius:2, width:"41%" },
    bs: { display:"flex", flexDirection:"column", gap:8 },
    br: { display:"flex", alignItems:"center", gap:10, padding:"10px 11px", background:"#F8F5EF", border:"1px solid rgba(12,26,46,0.09)", borderRadius:9 },
    bsq: { width:30, height:30, background:"#0C1A2E", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
    bsl: { fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:"#C9A84C", fontSize:14 },
    bt: { fontSize:13, fontWeight:500, color:"#0C1A2E", lineHeight:1.2 },
    bsub: { fontSize:11, color:"#94A3B8" },
    cta: { background:"#0C1A2E", borderRadius:14, padding:"1.25rem", border:"none" },
    ctap: { fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.55, margin:"0.5rem 0 1rem" },
    ctab: { display:"block", width:"100%", padding:10, background:"#C9A84C", color:"#0C1A2E", fontFamily:"'Jost',sans-serif", fontSize:12, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", border:"none", borderRadius:7, cursor:"pointer", textDecoration:"none", textAlign:"center" },
    footer: { borderTop:"1px solid rgba(12,26,46,0.09)", padding:"1.5rem 2.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:1200, margin:"0 auto" },
    fbrand: { fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:"#0C1A2E", letterSpacing:"-0.01em" },
    flinks: { display:"flex", gap:24 },
    flink: { fontSize:12, color:"#94A3B8", textDecoration:"none" },
  }
  return (
    <>
      <Head>
        <title>YMMH — Train ARIA</title>
        <meta name="description" content="Help train an intelligence from the ground up. Young's Multimedia Holdings community training initiative." />
      </Head>
      <nav style={s.nav}>
        <a href="#" style={s.brand}>
          <div style={s.mono}>Y<span style={{color:"#8B6914"}}>M</span>H</div>
          <div style={s.div}></div>
          <div style={s.btext}>Young&apos;s Multimedia<br/>Holdings LLC</div>
        </a>
        <div style={s.nr}>
          <div style={s.nstat}><span style={s.dot}></span>Training active</div>
          <a href={FB_GROUP} target="_blank" rel="noopener noreferrer" style={s.ncta}>Join community</a>
        </div>
      </nav>
      <section style={s.hero}>
        <div>
          <div style={s.tag}><span style={s.tagline}></span>Community Training Initiative</div>
          <h1 style={s.title}>Help build an<br/><em style={{fontStyle:"italic",color:"#8B6914"}}>intelligence</em><br/>from scratch</h1>
          <p style={s.body}>Young&apos;s Multimedia Holdings is training ARIA — a proprietary AI that will serve our entire portfolio. Every conversation you have here will be used to train her. That&apos;s why you&apos;re here.</p>
          <div style={s.notice}>
            <div style={s.nmark}>—</div>
            <div>No ambiguity: your conversations will be used to train AI. No personal data stored beyond your messages. You can stop anytime.</div>
          </div>
        </div>
        <div style={s.sc}>
          <div style={s.scey}>Live training metrics</div>
          <div style={s.sch}>ARIA is learning from every conversation in real time</div>
          <div style={s.scg}>
            {[
              {v: stats.total.toLocaleString(), l:"total conversations"},
              {v: stats.approved.toLocaleString(), l:"approved pairs"},
              {v: stats.todayCount.toLocaleString(), l:"chats today"},
              {v: stats.contributors.toLocaleString(), l:"contributors"},
            ].map((x,i)=>(
              <div key={i} style={s.scs}><div style={s.scv}>{x.v}</div><div style={s.scl}>{x.l}</div></div>
            ))}
          </div>
          <div style={s.scpr}><span>Training status</span><span>Active</span></div>
          <div style={s.scbar}><div style={s.scfill}></div></div>
        </div>
      </section>
      <div style={s.divider}><div style={s.dline}></div><div style={s.dtext}>Start a conversation</div><div style={s.dline}></div></div>
      <div style={s.layout}>
        <div style={s.chat}>
          <div style={s.ctop}>
            <div style={s.ar}>
              <div style={s.aorb}>
                <span style={s.aorl}>A</span>
                <div style={s.alive}></div>
              </div>
              <div>
                <div style={s.aname}>ARIA <span style={{fontWeight:300,color:"#94A3B8",fontSize:13}}>— training persona</span></div>
                <div style={s.ameta}>Powered by YMMH · Conversations reviewed, then used for training</div>
              </div>
            </div>
            <div style={s.tflag}>In training</div>
          </div>
          <div style={s.msgs} ref={msgsRef}>
            {msgs.map((m,i)=>(
              <div key={i} style={m.role==="user" ? s.msgWrapU : s.msgWrap}>
                {m.role==="assistant"
                  ? <div style={{...s.morb,background:"#0C1A2E"}}><span style={s.morbl}>A</span></div>
                  : <div style={{...s.morb,background:"#EEE9DF",border:"1px solid #E2DAC8",fontSize:9,color:"#94A3B8",fontWeight:500,letterSpacing:"0.06em"}}>YOU</div>
                }
                <div style={s.mbody}>
                  <div style={m.role==="user" ? s.mnamer : s.mname}>{m.role==="assistant"?"ARIA":"You"}</div>
                  <div style={m.role==="assistant" ? s.bai : s.bu}>{m.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={s.msgWrap}>
                <div style={{...s.morb,background:"#0C1A2E"}}><span style={s.morbl}>A</span></div>
                <div style={s.mbody}>
                  <div style={s.mname}>ARIA</div>
                  <div style={s.tw}>
                    <div style={{...s.td,animation:"tdot 1.3s ease-in-out infinite"}}></div>
                    <div style={{...s.td,animation:"tdot 1.3s ease-in-out infinite",animationDelay:"0.2s"}}></div>
                    <div style={{...s.td,animation:"tdot 1.3s ease-in-out infinite",animationDelay:"0.4s"}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {chips && (
            <div style={s.chips}>
              {CHIPS.map((c,i)=>(
                <button key={i} style={s.chip} onClick={()=>send(c)}>{c}</button>
              ))}
            </div>
          )}
          <div style={s.cfoot}>
            <div style={s.iw}>
              <textarea ref={taRef} style={s.mta} value={input} onChange={onInput} onKeyDown={onKey}
                placeholder="Talk to ARIA — your conversation will be used to train her..." rows={1} maxLength={20000} />
              <button style={s.sbtn} onClick={()=>send()} disabled={loading||!input.trim()}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="#C9A84C"><path d="M1 1l12 6-12 6V8.5l8.5-1.5L1 5.5V1z"/></svg>
              </button>
            </div>
            <div style={s.fm}>
              <span style={s.fn}>Your conversation will be used to train AI.</span>
              <span style={s.cc}>{input.length.toLocaleString()} / 20,000</span>
            </div>
          </div>
        </div>
        <div style={s.sb}>
          <div style={s.scard}>
            <h4 style={s.sh4}>Live stats</h4>
            {[
              {k:"Total conversations", v:stats.total.toLocaleString()},
              {k:"Approved pairs", v:stats.approved.toLocaleString(), g:true},
              {k:"Chats today", v:stats.todayCount.toLocaleString()},
              {k:"Contributors", v:stats.contributors.toLocaleString()},
            ].map((r,i)=>(
              <div key={i} style={{...s.slr,...(i===3?{borderBottom:"none"}:{})}}>
                <span style={s.slk}>{r.k}</span>
                <span style={{...s.slv,...(r.g?{color:"#8B6914"}:{})}}>{r.v}</span>
              </div>
            ))}
          </div>
          <div style={s.scard}>
            <h4 style={s.sh4}>Founding badges</h4>
            <div style={s.bs}>
              {[
                {l:"F",t:"Founding Trainer",s:"First 500 · Lifetime status"},
                {l:"E",t:"Early Access",s:"Priority at all YMMH launches"},
                {l:"C",t:"Origin Credit",s:"Named in ARIA's story"},
              ].map((b,i)=>(
                <div key={i} style={s.br}>
                  <div style={s.bsq}><span style={s.bsl}>{b.l}</span></div>
                  <div><div style={s.bt}>{b.t}</div><div style={s.bsub}>{b.s}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div style={s.cta}>
            <h4 style={{...s.sh4,color:"#C9A84C"}}>Founding trainers</h4>
            <p style={s.ctap}>Connect with other founding trainers. Get early access to everything YMMH builds.</p>
            <a href={FB_GROUP} target="_blank" rel="noopener noreferrer" style={s.ctab}>Join the community</a>
          </div>
        </div>
      </div>
      <footer style={s.footer}>
        <div style={s.fbrand}>Y<span style={{color:"#8B6914"}}>M</span>H</div>
        <div style={s.flinks}>
          <a href="#" style={s.flink}>Privacy</a>
          <a href="#" style={s.flink}>Terms</a>
          <a href="#" style={s.flink}>Training policy</a>
        </div>
      </footer>
      <style>{`
        @keyframes breathe { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.75)} }
        @keyframes tdot { 0%,60%,100%{transform:translateY(0);opacity:.35} 30%{transform:translateY(-4px);opacity:1} }
        textarea:focus{outline:none}
        button:disabled{opacity:.5;cursor:not-allowed}
      `}</style>
    </>
  )
}