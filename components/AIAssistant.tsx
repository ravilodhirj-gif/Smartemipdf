import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { LoanData, EMIDetails } from '../types';
import { getLoanInsights } from '../services/geminiService';

interface AIAssistantProps {
  loanData: LoanData;
  emiDetails: EMIDetails;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ loanData, emiDetails }) => {
  const [insight, setInsight] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setDisplayedText([]);
    setInsight('');
    try {
      const result = await getLoanInsights(loanData, emiDetails);
      setInsight(result || "Could not retrieve insights.");
    } catch (e) {
      setInsight("Unable to connect to financial strategist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInsights();
    }, 1000); // Debounce to prevent too many calls while sliding

    return () => {
      clearTimeout(delayDebounceFn);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [loanData.type, loanData.amount, loanData.monthlyIncome]);

  useEffect(() => {
    let active = true;
    if (!loading && insight) {
      const lines = insight.split('\n').filter(l => l.trim());
      setDisplayedText([]);
      let i = 0;
      
      const typeNextLine = () => {
        if (!active) return;
        if (i < lines.length) {
          const nextLine = lines[i];
          if (nextLine !== undefined) {
            setDisplayedText(prev => [...prev, nextLine]);
          }
          i++;
          timerRef.current = window.setTimeout(typeNextLine, 100);
        }
      };
      
      typeNextLine();
    }
    
    return () => {
      active = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [insight, loading]);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const speakInsights = async () => {
    if (!insight || isSpeaking) return;
    setIsSpeaking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const plainText = insight.replace(/[*#_]/g, '').substring(0, 1000); 
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: { parts: [{ text: `Mentor Update: ${plainText}` }] },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const bytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(bytes, audioContext, 24000, 1);
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsSpeaking(false);
        source.start(0);
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error("TTS Error:", err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="relative group overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-8 md:p-12 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.1)]">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-1000"></div>

      <div className="flex flex-col gap-6 md:gap-10 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-[1.75rem] bg-indigo-600 flex items-center justify-center text-white text-3xl md:text-4xl shadow-2xl shadow-indigo-500/40 group-hover:scale-110 transition-transform duration-500">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <h3 className="text-[10px] md:text-sm font-black text-indigo-500 uppercase tracking-[0.4em] font-heading mb-1 md:mb-1.5">Mentor Hub</h3>
              <span className="text-xl md:text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight">AI Strategy</span>
            </div>
          </div>
          
          <div className="flex gap-2 md:gap-3">
            <button 
              onClick={speakInsights}
              disabled={loading || isSpeaking || !insight}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-sm border ${
                isSpeaking 
                  ? 'bg-indigo-600 text-white animate-pulse border-indigo-500 shadow-lg shadow-indigo-500/50' 
                  : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 border-slate-100 dark:border-slate-700'
              }`}
              title="Voice Briefing"
            >
              <i className={`fa-solid ${isSpeaking ? 'fa-waveform-lines' : 'fa-headset'} text-lg md:text-xl`}></i>
            </button>
            <button 
              onClick={fetchInsights}
              disabled={loading}
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-indigo-600 transition-all active:rotate-180 disabled:opacity-50 flex items-center justify-center shadow-sm"
            >
              <i className={`fa-solid fa-arrows-rotate text-lg md:text-xl ${loading ? 'animate-spin' : ''}`}></i>
            </button>
          </div>
        </div>

        <div className="text-slate-700 dark:text-slate-300 relative min-h-[160px]">
          {loading ? (
            <div className="space-y-4 md:space-y-6 animate-pulse pt-4">
              <div className="h-5 md:h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-4/5"></div>
              <div className="h-5 md:h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-full"></div>
              <div className="h-5 md:h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-2/3"></div>
            </div>
          ) : (
            <div className="text-lg md:text-xl leading-relaxed space-y-4 md:space-y-6 font-medium">
              {displayedText.map((line, i) => {
                if (!line) return null;
                const isBullet = line.trim().startsWith('*') || line.trim().startsWith('-') || /^\d\./.test(line.trim());
                return (
                  <div key={i} className="flex gap-4 md:gap-6 items-start animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both">
                    {isBullet ? (
                      <div className="mt-2.5 md:mt-3 w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] shrink-0"></div>
                    ) : null}
                    <p className="opacity-95 leading-snug tracking-tight font-heading">
                      {line.trim().replace(/^[\*-]\s*/, '').replace(/^\d\.\s*/, '')}
                    </p>
                  </div>
                );
              })}
              {displayedText.length === 0 && insight && !loading && (
                 <div className="h-6 w-1.5 bg-indigo-500 animate-pulse"></div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-slate-50 dark:border-slate-800/60 flex justify-between items-center">
        <span className="text-[8px] md:text-xs font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em] font-heading">Engineered by Gemini Intelligence</span>
        <div className="flex gap-2 md:gap-3">
          <div className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-indigo-500 ${loading ? 'animate-ping' : ''}`}></div>
          <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-indigo-500/40"></div>
          <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-indigo-500/20"></div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;