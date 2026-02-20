"use client";

import { useState, useEffect } from "react";

const CONVEX_URL = "https://quixotic-sheep-608.eu-west-1.convex.cloud";
const CONVEX_KEY = "chloe-moltini:soloi-command-dashboard:2026-02-20";

const colors: Record<string, string> = {
  todo: "#ef4444",
  "in-progress": "#eab308",
  done: "#22c55e",
};

const agentColors: Record<string, string> = {
  me: "#4a9eff",
  chloe: "#6366f1",
  joe: "#f59e0b",
  supriye: "#f472b6",
  leo: "#ef4444",
  max: "#22c55e",
};

const stageColors: Record<string, string> = {
  idea: "#8b5cf6",
  script: "#3b82f6",
  thumbnail: "#f59e0b",
  filming: "#ef4444",
  publish: "#22c55e",
};

const roleColors: Record<string, string> = {
  sovereign: "#c9a227",
  developer: "#22c55e",
  writer: "#3b82f6",
  designer: "#f472b6",
  researcher: "#8b5cf6",
};

// Seed team data (embedded for now)
const SEED_TEAM = [
  { _id: "1", name: "Chloe", role: "sovereign", type: "agent", avatar: "/avatars/chloe.png", status: "active", description: "Queen of the Castle" },
  { _id: "2", name: "Joe", role: "writer", type: "agent", avatar: "/avatars/joe.png", status: "active", description: "Merchant Voyager" },
  { _id: "3", name: "Leo", role: "researcher", type: "agent", avatar: "/avatars/leo.png", status: "active", description: "Insight Hunter" },
  { _id: "4", name: "Max", role: "developer", type: "agent", avatar: "/avatars/max.png", status: "active", description: "Fitness Champion" },
  { _id: "5", name: "Süpriye", role: "designer", type: "agent", avatar: "/avatars/supriye.png", status: "active", description: "Digital Guardian" },
];

async function query<T>(name: string): Promise<T[]> {
  try {
    const res = await fetch(`${CONVEX_URL}/api/${name}`, {
      headers: { "Convex-Client": CONVEX_KEY },
    });
    return await res.json();
  } catch {
    return [];
  }
}

async function mutate(name: string, args: Record<string, unknown>) {
  await fetch(`${CONVEX_URL}/api/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Convex-Client": CONVEX_KEY,
    },
    body: JSON.stringify({ args }),
  });
}

interface Task {
  _id: string;
  title: string;
  status: string;
  assignedTo: string;
}

interface PipelineItem {
  _id: string;
  title: string;
  idea: string;
  script: string;
  thumbnail: string;
  stage: string;
}

interface CalendarItem {
  _id: string;
  title: string;
  description: string;
  scheduledAt: number;
}

interface MemoryItem {
  _id: string;
  title: string;
  content: string;
  tags: string[];
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  type: string;
  status: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [calendar, setCalendar] = useState<CalendarItem[]>([]);
  const [memory, setMemory] = useState<MemoryItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>(SEED_TEAM);
  const [newTask, setNewTask] = useState("");
  const [newContent, setNewContent] = useState("");
  const [search, setSearch] = useState("");
  const [clock, setClock] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamRole, setNewTeamRole] = useState("developer");
  const [calTitle, setCalTitle] = useState("");
  const [calDate, setCalDate] = useState("");
  const [memTitle, setMemTitle] = useState("");
  const [memContent, setMemContent] = useState("");
  const [memTags, setMemTags] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    setTasks(await query<Task>("tasks:get"));
    setPipeline(await query<PipelineItem>("pipeline:get"));
    setCalendar(await query<CalendarItem>("calendar:get"));
    setMemory(search ? await query<MemoryItem>(`memory:search?search=${search}`) : await query<MemoryItem>("memory:get"));
    // Team is loaded from SEED_TEAM (embedded)
  };

  useEffect(() => {
    loadData();
  }, [search]);

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = today.toLocaleString("default", { month: "long" });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at top, #0f1729 0%, #0a0a0f 50%)" }}>
      {/* Header */}
      <header className="border-b border-[#c9a227]/20 bg-[#0f1729]/90 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/coat.svg" alt="Soloi Coat of Arms" className="w-12 h-14 object-contain" />
            <div>
              <h1 className="text-lg font-bold" style={{ fontFamily: "Cinzel, serif", color: "#c9a227" }}>
                SOLOI CASTLE
              </h1>
              <p className="text-xs" style={{ color: "#c9a227", opacity: 0.6 }}>
                Royal Command Centre
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono" style={{ fontFamily: "Orbitron, sans-serif", color: "#c9a227" }}>
              {clock}
            </span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Mission Control Grid */}
      <main className="max-w-[1600px] mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Panel 1: Tasks Board */}
          <div className="bg-[#0f1729] rounded-xl p-4 border border-[#c9a227]/20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📋</span>
              <h2 className="text-sm font-bold" style={{ fontFamily: "Cinzel, serif", color: "#c9a227" }}>
                ROYAL TASK COUNCIL
              </h2>
            </div>
            <div className="flex gap-1 mb-3">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTask.trim()) {
                    mutate("tasks:add", { title: newTask, status: "todo", assignedTo: "me" });
                    setNewTask("");
                    loadData();
                  }
                }}
                placeholder="New decree..."
                className="flex-1 bg-[#0a0a0f] border border-[#c9a227]/20 rounded px-2 py-1 text-xs"
              />
              <button
                onClick={() => {
                  if (newTask.trim()) {
                    mutate("tasks:add", { title: newTask, status: "todo", assignedTo: "me" });
                    setNewTask("");
                    loadData();
                  }
                }}
                className="px-3 rounded bg-[#c9a227] text-[#0a0a0f] font-bold text-xs"
              >
                +
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["todo", "in-progress", "done"] as const).map((s) => (
                <div key={s}>
                  <div className="text-[10px] mb-1" style={{ color: colors[s] }}>
                    {s === "todo" ? "🔴 TODO" : s === "in-progress" ? "🟡 IN PROG" : "🟢 DONE"}
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {tasks.filter((t) => t.status === s).map((t) => (
                      <div
                        key={t._id}
                        className="bg-[#0a0a0f] rounded p-2 border-l-2 text-xs"
                        style={{ borderColor: agentColors[t.assignedTo] || "#666" }}
                      >
                        <div className="truncate">{t.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 2: Content Pipeline */}
          <div className="bg-[#0f1729] rounded-xl p-4 border border-[#c9a227]/20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🎬</span>
              <h2 className="text-sm font-bold" style={{ fontFamily: "Cinzel, serif", color: "#c9a227" }}>
                ROYAL PRODUCTION
              </h2>
            </div>
            <div className="flex gap-1 mb-3 overflow-x-auto pb-2">
              {(["idea", "script", "thumbnail", "filming", "publish"] as const).map((s) => (
                <div
                  key={s}
                  className="px-2 py-1 rounded text-[10px] whitespace-nowrap"
                  style={{ background: `${stageColors[s]}20`, color: stageColors[s] }}
                >
                  {s === "idea" ? "💡" : s === "script" ? "📝" : s === "thumbnail" ? "🖼️" : s === "filming" ? "🎥" : "🚀"} {s.toUpperCase()}
                </div>
              ))}
            </div>
            <div className="flex gap-1 mb-3">
              <input
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newContent.trim()) {
                    mutate("pipeline:add", { title: newContent, idea: "", script: "", thumbnail: "", stage: "idea" });
                    setNewContent("");
                    loadData();
                  }
                }}
                placeholder="New production..."
                className="flex-1 bg-[#0a0a0f] border border-[#c9a227]/20 rounded px-2 py-1 text-xs"
              />
              <button
                onClick={() => {
                  if (newContent.trim()) {
                    mutate("pipeline:add", { title: newContent, idea: "", script: "", thumbnail: "", stage: "idea" });
                    setNewContent("");
                    loadData();
                  }
                }}
                className="px-3 rounded bg-[#c9a227] text-[#0a0a0f] font-bold text-xs"
              >
                +
              </button>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {pipeline.map((p) => (
                <div
                  key={p._id}
                  className="bg-[#0a0a0f] rounded p-2 border-l-2 text-xs flex justify-between items-center"
                  style={{ borderColor: stageColors[p.stage] }}
                >
                  <span className="truncate flex-1">{p.title}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded ml-2" style={{ background: `${stageColors[p.stage]}20`, color: stageColors[p.stage] }}>
                    {p.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 3: Calendar */}
          <div className="bg-[#0f1729] rounded-xl p-4 border border-[#c9a227]/20 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📅</span>
              <h2 className="text-sm font-bold" style={{ fontFamily: "Cinzel, serif", color: "#c9a227" }}>
                ROYAL CALENDAR
              </h2>
            </div>
            <div className="text-center text-xs mb-2" style={{ color: "#c9a227" }}>
              {monthName} {currentYear}
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-[9px] mb-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-center text-gray-500">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-[9px] mb-3">
              {calendarDays.map((day, i) => (
                <div
                  key={i}
                  className={`text-center p-1 rounded ${
                    day === today.getDate() ? "bg-[#c9a227] text-[#0a0a0f] font-bold" : "text-gray-400"
                  }`}
                >
                  {day || ""}
                </div>
              ))}
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {calendar.slice(0, 3).map((c) => (
                <div key={c._id} className="bg-[#0a0a0f] rounded p-1.5 border-l-2 border-[#c9a227] text-[9px]">
                  <div className="font-medium truncate">{c.title}</div>
                  <div className="text-gray-500">{new Date(c.scheduledAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 4: Memory Archive */}
          <div className="bg-[#0f1729] rounded-xl p-4 border border-[#c9a227]/20 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💾</span>
              <h2 className="text-sm font-bold" style={{ fontFamily: "Cinzel, serif", color: "#c9a227" }}>
                ROYAL MEMORY
              </h2>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search..."
              className="w-full mb-2 bg-[#0a0a0f] border border-[#c9a227]/20 rounded px-2 py-1 text-xs"
            />
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {memory.slice(0, 4).map((m) => (
                <div key={m._id} className="bg-[#0a0a0f] rounded p-2 border border-[#c9a227]/10">
                  <div className="text-xs font-bold" style={{ color: "#c9a227" }}>{m.title}</div>
                  <div className="text-[10px] text-gray-400 truncate">{m.content}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 5: Team Overview */}
          <div className="bg-[#0f1729] rounded-xl p-4 border border-[#c9a227]/20 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <h2 className="text-sm font-bold" style={{ fontFamily: "Cinzel, serif", color: "#c9a227" }}>
                  ROYAL COURT
                </h2>
              </div>
              <button
                onClick={() => setTeam(SEED_TEAM)}
                className="text-[9px] px-2 py-1 rounded bg-[#c9a227]/10 text-[#c9a227]"
              >
                ↻ Reset
              </button>
            </div>
            {/* Main Agents Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {team.filter(t => t.type === "agent").map((t) => (
                <div key={t._id} className="bg-[#0a0a0f] rounded-lg p-2 border border-[#c9a227]/20 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2" style={{ borderColor: roleColors[t.role] || "#c9a227" }}>
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1e293b] flex items-center justify-center text-lg" style={{ color: roleColors[t.role] }}>
                        {t.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-bold mt-1" style={{ color: "#c9a227" }}>{t.name}</div>
                  <div className="text-[8px]" style={{ color: roleColors[t.role] }}>{t.description}</div>
                  <div className={`w-2 h-2 rounded-full mt-1 ${t.status === "active" ? "bg-green-500" : "bg-gray-500"}`} />
                </div>
              ))}
            </div>
            {/* Subagents by role */}
            <div className="text-[9px] mb-2" style={{ color: "#c9a227" }}>SUBAGENTS</div>
            <div className="flex flex-wrap gap-1">
              {team.filter(t => t.type === "subagent").map((t) => (
                <div key={t._id} className="bg-[#0a0a0f] rounded px-2 py-1 border border-[#c9a227]/10 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${t.status === "active" ? "bg-green-500" : "bg-gray-500"}`} />
                  <span className="text-[9px]">{t.name}</span>
                  <span className="text-[8px] capitalize" style={{ color: roleColors[t.role] }}>({t.role})</span>
                </div>
              ))}
              {team.filter(t => t.type === "subagent").length === 0 && (
                <div className="text-[8px] text-gray-500">No subagents yet</div>
              )}
            </div>
          </div>

          {/* Panel 6: Virtual Office */}
          <div className="bg-[#0f1729] rounded-xl p-4 border border-[#c9a227]/20 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏰</span>
              <h2 className="text-sm font-bold" style={{ fontFamily: "Cinzel, serif", color: "#c9a227" }}>
                THE HIGH TOWER
              </h2>
              <span className="text-[10px] ml-auto" style={{ color: "#c9a227" }}>Soloi Castle</span>
            </div>
            
            {/* Office Grid - 2x2 for main agents - Medieval Style */}
            <div className="grid grid-cols-2 gap-3">
              {team.filter(t => t.type === "agent").map((agent) => (
                <div 
                  key={agent._id} 
                  className="relative rounded-lg p-3 border-2 overflow-hidden"
                  style={{ 
                    backgroundColor: '#1a1510',
                    borderColor: '#c9a227',
                    backgroundImage: `
                      linear-gradient(rgba(26, 21, 16, 0.9), rgba(26, 21, 16, 0.9)),
                      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233d2e1f' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                    `
                  }}
                >
                  {/* Stone wall texture overlay */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"100\" height=\"100\" fill=\"none\" stroke=\"%23c9a227\" stroke-width=\"1\"/%3E%3C/svg%3E")',
                  }}></div>
                  
                  {/* Room Label with medieval banner style */}
                  <div className="relative text-[10px] mb-2 px-2 py-1 rounded-sm inline-block" style={{ 
                    backgroundColor: '#2a1f15', 
                    color: '#c9a227',
                    border: '1px solid #c9a227'
                  }}>
                    {agent.role === 'sovereign' ? '👑 Throne Room' : 
                     agent.role === 'developer' ? '💻 Code Library' :
                     agent.role === 'writer' ? '📜 Scriptorium' :
                     agent.role === 'designer' ? '🎨 Artisan Workshop' : '📚 Archives'}
                  </div>
                  
                  {/* Medieval Desk Area */}
                  <div className="relative flex items-center gap-3 mt-2">
                    {/* Wooden Chair with cushion */}
                    <div className="relative">
                      {/* Chair back */}
                      <div className="w-6 h-8 rounded-t-lg flex items-center justify-center" style={{ 
                        background: 'linear-gradient(to right, #5c3d2e, #8b5a3c, #5c3d2e)',
                        border: '2px solid #c9a227'
                      }}>
                        <div className="w-4 h-4 rounded-full" style={{ background: '#8b0000' }}></div>
                      </div>
                      {/* Chair seat */}
                      <div className="w-6 h-2 mx-auto rounded-b-sm" style={{ background: '#5c3d2e', borderLeft: '2px solid #c9a227', borderRight: '2px solid #c9a227' }}></div>
                      {/* Person */}
                      <div className={`absolute top-1 left-1/2 -translate-x-1/2 -mt-2 w-9 h-9 rounded-full overflow-hidden border-2 ${agent.status === 'active' ? 'border-green-500 shadow-lg shadow-green-500/50' : 'border-gray-500'}`}>
                        <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                      </div>
                      {/* Status indicator glow */}
                      {agent.status === 'active' && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-9 h-9 rounded-full bg-green-500/20 animate-pulse"></div>
                      )}
                    </div>
                    
                    {/* Wooden Desk with Medieval Computer */}
                    <div className="flex-1">
                      {/* Desk surface - carved wood */}
                      <div className="h-3 rounded-sm mb-1" style={{ 
                        background: 'linear-gradient(to right, #3d2817, #5c3d2e 20%, #4a3220 80%, #3d2817)',
                        border: '1px solid #c9a227'
                      }}></div>
                      
                      {/* Medieval Monitor - ornate frame */}
                      <div className="relative bg-[#0a0a0f] rounded-sm border-2" style={{ borderColor: '#c9a227' }}>
                        {/* Ornate corners */}
                        <div className="absolute -top-1 -left-1 w-2 h-2" style={{ background: '#c9a227' }}></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2" style={{ background: '#c9a227' }}></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2" style={{ background: '#c9a227' }}></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2" style={{ background: '#c9a227' }}></div>
                        
                        <div className="h-10 p-1">
                          {agent.status === 'active' ? (
                            <div className="h-full rounded flex items-center justify-center" style={{ 
                              background: 'linear-gradient(to bottom, #0f1729, #1a2744)',
                              border: '1px solid #22c55e'
                            }}>
                              <span className="text-[8px] text-green-400">⚔️ Coding...</span>
                            </div>
                          ) : (
                            <div className="h-full rounded flex items-center justify-center" style={{ 
                              background: 'linear-gradient(to bottom, #0a0a0f, #1a1a1a)',
                              border: '1px solid #4a4a4a'
                            }}>
                              <span className="text-[8px] text-gray-500">💤 Resting</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Candle/desk lamp */}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <div className="w-2 h-3 rounded-sm" style={{ background: '#5c3d2e' }}></div>
                        <div className="relative">
                          <div className="w-1 h-2 rounded-full" style={{ background: '#c9a227' }}></div>
                          {agent.status === 'active' && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full animate-pulse" style={{ 
                              background: 'radial-gradient(yellow, orange)',
                              boxShadow: '0 0 4px yellow'
                            }}></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Name & Role - medieval plaque style */}
                  <div className="relative mt-2 flex items-center justify-between">
                    <div className="px-2 py-0.5 rounded-sm" style={{ backgroundColor: '#2a1f15', border: '1px solid #c9a227' }}>
                      <span className="text-[9px] font-bold" style={{ color: '#c9a227' }}>{agent.name}</span>
                    </div>
                    <span className="text-[8px]" style={{ color: roleColors[agent.role] }}>{agent.description}</span>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-2 right-2 text-xs opacity-40">🏰</div>
                  <div className="absolute bottom-8 left-2 text-[8px] opacity-20">⚜️</div>
                </div>
              ))}
            </div>
            
            {/* Status Bar - medieval style */}
            <div className="mt-3 pt-2 border-t-2 flex items-center justify-between" style={{ borderColor: '#c9a227' }}>
              <div className="flex gap-3">
                <span className="flex items-center gap-1 text-[8px]">
                  <span className="w-2 h-2 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 4px #22c55e' }}></span>
                  <span className="text-gray-400">Active: {team.filter(t => t.status === 'active').length}</span>
                </span>
                <span className="flex items-center gap-1 text-[8px]">
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                  <span className="text-gray-400">Idle: {team.filter(t => t.status !== 'active').length}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px]" style={{ color: '#c9a227' }}>🏰 The High Tower • Soloi Castle</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
