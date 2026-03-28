'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function WelcomePage() {
  const router = useRouter()
  const [showHero, setShowHero] = useState(false)

  useEffect(() => {
    // Fade hero in as the flip settles (1.9s)
    const t = setTimeout(() => setShowHero(true), 1900)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-dvh flex flex-col overflow-hidden">

      {/* ── White section ── */}
      <div
        style={{
          position: 'relative',
          background: '#e8e8e8',
          height: '57vh',
          flexShrink: 0,
          overflow: 'hidden',
          /* perspective lives here so it applies to the phone child */
          perspective: '1100px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Language selector */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 30 }}>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#fff', border: 'none',
              borderRadius: 24, padding: '8px 15px',
              fontSize: 15, fontWeight: 500, color: '#000',
              boxShadow: '0 2px 12px rgba(0,0,0,0.16)', cursor: 'pointer',
            }}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <rect width="20" height="14" rx="2" fill="#B22234"/>
              <rect y="1.08" width="20" height="1.08" fill="white"/>
              <rect y="3.23" width="20" height="1.08" fill="white"/>
              <rect y="5.38" width="20" height="1.08" fill="white"/>
              <rect y="7.54" width="20" height="1.08" fill="white"/>
              <rect y="9.69" width="20" height="1.08" fill="white"/>
              <rect y="11.85" width="20" height="1.08" fill="white"/>
              <rect width="8" height="7.54" fill="#3C3B6E"/>
            </svg>
            EN
          </button>
        </div>

        {/* Centering + float wrapper */}
        <div
          className="phone-float"
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '74vw',
            maxWidth: 298,
            zIndex: 10,
          }}
        >
          {/*
            Phone frame — rotates on Y from 180° (back) → 0° (front).
            transform-style: preserve-3d lets front/back faces live in true 3D.
            The silver border sits on this element and shows on both sides.
          */}
          <div
            className="phone-flip"
            style={{
              width: '100%',
              aspectRatio: '9 / 19.5',
              borderRadius: 50,
              border: '9px solid #c6c6c6',
              position: 'relative',
              transformStyle: 'preserve-3d',
              boxShadow: [
                '0 0 0 1px #ababab',
                '0 0 0 2.5px #e2e2e2',
                '0 28px 72px rgba(0,0,0,0.28)',
                '0 8px 20px rgba(0,0,0,0.14)',
              ].join(', '),
            }}
          >
            {/* Side buttons — on the frame, visible during flip */}
            <div style={{ position:'absolute', left:-11, top:76,  width:3.5, height:30, background:'linear-gradient(90deg,#999,#c8c8c8,#999)', borderRadius:2, zIndex:20 }} />
            <div style={{ position:'absolute', left:-11, top:116, width:3.5, height:50, background:'linear-gradient(90deg,#999,#c8c8c8,#999)', borderRadius:2, zIndex:20 }} />
            <div style={{ position:'absolute', left:-11, top:174, width:3.5, height:50, background:'linear-gradient(90deg,#999,#c8c8c8,#999)', borderRadius:2, zIndex:20 }} />
            <div style={{ position:'absolute', right:-11,top:116, width:3.5, height:70, background:'linear-gradient(90deg,#c8c8c8,#999,#c8c8c8)', borderRadius:2, zIndex:20 }} />

            {/* ── FRONT FACE — screen ── */}
            <div
              style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderRadius: 41,
                overflow: 'hidden',
                background: '#0a0a0a',
              }}
            >
              {/* Dynamic Island */}
              <div style={{
                position:'absolute', top:11, left:'50%',
                transform:'translateX(-50%)',
                width:'33%', height:28,
                background:'#000', borderRadius:16, zIndex:30,
              }}>
                <div style={{
                  position:'absolute', right:8, top:'50%', transform:'translateY(-50%)',
                  width:8, height:8, borderRadius:'50%',
                  background:'radial-gradient(circle at 35% 35%,#2a2a2a,#0a0a0a)',
                  boxShadow:'0 0 0 1px rgba(255,255,255,0.06)',
                }} />
              </div>

              {/* Hero image — fades in after flip */}
              <div style={{
                position:'absolute', inset:0, zIndex:4,
                backgroundImage:'url(/hero.jpg)',
                backgroundSize:'cover',
                backgroundPosition:'center top',
                opacity: showHero ? 1 : 0,
                transition:'opacity 1s ease',
              }} />

              {/* Dark fallback while hero loads */}
              <div style={{
                position:'absolute', inset:0,
                background:'linear-gradient(180deg,#181818 0%,#0a0a0a 100%)',
              }} />

              {/* Ambient corner light */}
              <div style={{
                position:'absolute', inset:0, zIndex:8,
                background:'linear-gradient(125deg,rgba(255,255,255,0.10) 0%,rgba(255,255,255,0.02) 30%,transparent 55%)',
                mixBlendMode:'soft-light',
                pointerEvents:'none', borderRadius:41,
              }} />

              {/* One-shot glint sweep */}
              <div
                className="screen-glint"
                style={{
                  position:'absolute', inset:0, zIndex:9,
                  background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.16) 50%,transparent 100%)',
                  width:'45%', opacity:0,
                  pointerEvents:'none',
                }}
              />

              {/* Inner edge shadow */}
              <div style={{
                position:'absolute', inset:0, zIndex:10,
                boxShadow:'inset 0 0 22px rgba(0,0,0,0.5)',
                borderRadius:41, pointerEvents:'none',
              }} />
            </div>

            {/* ── BACK FACE — camera + Apple logo ── */}
            <div
              style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                borderRadius: 41,
                overflow: 'hidden',
                background: 'linear-gradient(150deg, #1e1e1e 0%, #111 50%, #0a0a0a 100%)',
              }}
            >
              {/* Camera module bump */}
              <div style={{
                position:'absolute', top:'7%', left:'7%',
                width:'42%', aspectRatio:'1/1.05',
                background:'linear-gradient(145deg,#141414,#0a0a0a)',
                borderRadius:'22%',
                boxShadow:'0 6px 20px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.07)',
                padding:'10%',
                display:'grid',
                gridTemplateColumns:'1fr 1fr',
                gridTemplateRows:'1fr 0.35fr',
                gap:'8%',
              }}>
                {/* Main lens */}
                <div style={{
                  aspectRatio:'1', borderRadius:'50%',
                  background:'radial-gradient(circle at 33% 28%,#1e2d3d,#05080d)',
                  boxShadow:'0 0 0 2.5px rgba(255,255,255,0.13),0 0 0 4px rgba(0,0,0,0.5),inset 0 0 14px rgba(0,0,0,0.9)',
                }} />
                {/* Ultrawide lens */}
                <div style={{
                  aspectRatio:'1', borderRadius:'50%',
                  background:'radial-gradient(circle at 33% 28%,#1e2d3d,#05080d)',
                  boxShadow:'0 0 0 2.5px rgba(255,255,255,0.13),0 0 0 4px rgba(0,0,0,0.5),inset 0 0 14px rgba(0,0,0,0.9)',
                }} />
                {/* Flash + mic row */}
                <div style={{
                  gridColumn:'1/-1',
                  display:'flex', alignItems:'center',
                  justifyContent:'flex-end', gap:'10%',
                }}>
                  <div style={{
                    width:'22%', aspectRatio:'1', borderRadius:'50%',
                    background:'radial-gradient(circle,#ccc,#888)',
                    boxShadow:'0 0 0 1.5px rgba(255,255,255,0.25)',
                  }} />
                  <div style={{
                    width:'13%', aspectRatio:'1', borderRadius:'50%',
                    background:'#444',
                  }} />
                </div>
              </div>

              {/* Apple logo — etched centre */}
              <svg
                viewBox="0 0 814 1000"
                style={{
                  position:'absolute',
                  top:'48%', left:'50%',
                  transform:'translate(-50%,-50%)',
                  width:'18%', opacity:0.22,
                  fill:'rgba(255,255,255,0.6)',
                }}
              >
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.2-150.2-98.8C57.3 827.5 13.2 727.5 13.2 633c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2l-13.2 8.8zM536.5 177.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
              </svg>

              {/* Subtle surface sheen */}
              <div style={{
                position:'absolute', inset:0,
                background:'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,transparent 50%)',
                pointerEvents:'none',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Black section ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col flex-1"
        style={{
          position: 'relative',
          background: '#000',
          paddingTop: 36,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 40,
          textAlign: 'center',
          fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Arial,sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Radial gray glow behind text */}
        <div aria-hidden style={{
          position:'absolute', inset:0,
          background:'radial-gradient(ellipse 120% 65% at 50% 35%,#3a3a3a 0%,#1c1c1c 40%,#000 70%)',
          pointerEvents:'none', zIndex:0,
        }} />

        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', flex:1 }}>
          <h1 style={{
            fontSize:'clamp(34px,6vw,44px)',
            fontWeight:500,
            color:'#fff',
            lineHeight:1.05,
            letterSpacing:'-0.02em',
            whiteSpace:'nowrap',
            margin:'0 auto 14px',
          }}>
            Become Top-Tier
          </h1>

          <p style={{
            fontSize:16,
            fontWeight:400,
            color:'rgba(255,255,255,0.68)',
            lineHeight:1.55,
            maxWidth:300,
            marginLeft:'auto',
            marginRight:'auto',
          }}>
            Get your attraction ratings, routine,{' '}
            products &amp; more to ascend in{' '}
            <span style={{
              background:'linear-gradient(90deg,#4FD1C5,#81E6D9)',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
              fontWeight:500,
            }}>
              90 days
            </span>
          </p>

          <div style={{ flex:1 }} />

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/onboarding')}
            style={{
              display:'block', width:'100%',
              padding:'20px 24px',
              background:'#fff', color:'#000',
              fontSize:18, fontWeight:500,
              border:'none', borderRadius:18,
              cursor:'pointer', marginTop:28,
              fontFamily:'inherit',
            }}
          >
            Get started
          </motion.button>
        </div>
      </motion.div>
    </main>
  )
}
