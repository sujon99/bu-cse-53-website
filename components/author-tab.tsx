'use client';

import React from 'react';
import { Github, Linkedin, Globe, Mail, Code2, Server, Cloud, Terminal, Cpu, Camera, Heart, Sparkles, Layers, Rocket, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { TiltCard } from '@/components/ui/tilt-card';
import { ConstellationBackground } from '@/components/constellation-effect';

const AUTHOR_INFO = {
    name: "MD. Sujon Sarder",
    role: "System Engineer",
    company: "REVE Systems Ltd.",
    bio: "Building scalable and resilient systems that millions love. With over 7 years of experience in DevOps and cloud infrastructure, I specialize in automating complex workflows and ensuring 99.9% system reliability.",
    location: "Dhaka, Bangladesh",
    contact: {
        github: "https://github.com/sujon99",
        linkedin: "https://www.linkedin.com/in/smsujon99",
        website: "https://sujon.com.bd",
        email: "mailto:contact@sujon.com.bd"
    },
    stats: [
        { label: "Experience", value: "7+ Years" },
        { label: "Uptime Achieved", value: "99.9%" },
        { label: "Cloud Costs", value: "-25%" },
    ],
    skills: {
        cloud: ["AWS", "Azure", "GCP"],
        devops: ["Docker", "Kubernetes", "Helm", "Terraform", "Ansible"],
        cicd: ["Jenkins", "GitLab CI", "GitHub Actions"]
    }
};

export function AuthorTab() {
    return (
        <div className="relative min-h-[85vh] w-full overflow-hidden flex flex-col items-center py-16 pt-0 px-4 sm:px-6">

            {/* --- BACKGROUND FROM HERO SECTION --- */}
            {/* Warm overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-background to-rose-900/10 -z-20" />

            {/* Nostalgic film grain effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* --- NEW: INTERACTIVE CONSTELLATION --- */}
            <ConstellationBackground />

            {/* Warm bokeh lights */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-amber-500/10 blur-[100px] animate-float-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-500/10 blur-[120px] animate-float-slow-reverse" />
            </div>

            {/* --- CONTENT --- */}
            <div className="w-full max-w-5xl relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/10 border border-amber-200/20 backdrop-blur-sm mb-8 text-amber-700 dark:text-amber-300">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm tracking-wide font-medium">The Creator</span>
                </div>

                {/* Profile "Polaroid" with 3D Tilt */}
                <div className="mb-8 relative z-20">
                    <TiltCard className="group cursor-pointer" rotationFactor={12}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-rose-400 rounded-2xl blur opacity-30 group-hover:opacity-80 transition duration-500"></div>
                        <div className="relative bg-white dark:bg-stone-900 p-3 pb-12 shadow-2xl rounded-sm border border-stone-200 dark:border-stone-800">
                            <div className="relative w-40 h-40 sm:w-52 sm:h-52 bg-stone-100 dark:bg-stone-800 flex items-center justify-center overflow-hidden border border-stone-100 dark:border-stone-700 shadow-inner rounded-xl group-hover:scale-[1.02] transition-transform duration-500">
                                {/* Avatar Image */}
                                <Image
                                    src="https://lh3.googleusercontent.com/d/1P-7s5IGz_pMONYqZsgZ8t7rNy0awS_Cu=w720"
                                    alt="MD. Sujon Sarder"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        {/* Signature aesthetic (Overlayed) */}
                        <div className="absolute bottom-4 left-0 right-0 text-center font-handwriting text-stone-500 text-lg sm:text-2xl -rotate-2 text-amber-800/80 dark:text-amber-400/80 font-semibold z-10 pointer-events-none">
                            Sujon
                        </div>
                    </TiltCard>
                </div>

                {/* Name */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-stone-900 dark:text-white mb-2 tracking-tight">
                    {AUTHOR_INFO.name}
                </h1>

                {/* Designation - Moved Here */}
                <p className="text-xl sm:text-2xl font-light text-amber-600 dark:text-amber-400 mb-6 font-serif italic flex items-center gap-3">
                    <span className="h-px w-8 bg-amber-400/50"></span>
                    {AUTHOR_INFO.role}
                    <span className="h-px w-8 bg-amber-400/50"></span>
                </p>

                {/* Company / Tagline */}
                <p className="text-base sm:text-lg text-stone-500 dark:text-stone-400 font-light mb-10 max-w-2xl">
                    Building resilient cloud systems at <span className="font-medium text-stone-700 dark:text-stone-300">{AUTHOR_INFO.company}</span>
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 sm:gap-12 mb-12 w-full max-w-2xl px-2 sm:px-0">
                    {AUTHOR_INFO.stats.map((stat) => (
                        <div key={stat.label} className="text-center p-2 sm:p-4 bg-white/50 dark:bg-stone-900/30 rounded-xl border border-stone-100 dark:border-stone-800/50 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-amber-200/50 hover:bg-amber-50/50 dark:hover:bg-amber-900/20">
                            <div className="text-lg sm:text-3xl font-serif font-medium text-amber-600 dark:text-amber-400 mb-0.5 sm:mb-1">{stat.value}</div>
                            <div className="text-[10px] sm:text-sm text-stone-500 uppercase tracking-widest leading-tight">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full text-left">

                    {/* Left Column: Bio & Professional Work */}
                    <div className="space-y-8">
                        {/* About Me */}
                        <SectionCard title="About Me" icon={<Award className="w-5 h-5 text-amber-500" />}>
                            <p className="text-stone-600 dark:text-stone-300 leading-relaxed italic mb-4">
                                "{AUTHOR_INFO.bio}"
                            </p>
                            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                                I specialize in <strong>Kubernetes</strong>, <strong>Docker</strong>, and <strong>Terraform</strong>, helping organizations deliver software faster. Currently managing omnichannel support portals and high-availability infrastructure.
                            </p>
                        </SectionCard>

                        {/* Professional Highlights */}
                        <SectionCard title="Professional Highlights" icon={<Rocket className="w-5 h-5 text-rose-500" />}>
                            <div className="space-y-4">
                                <div className="group cursor-pointer">
                                    <h4 className="font-medium text-stone-800 dark:text-stone-200 group-hover:text-amber-600 transition-colors">Multi-Cloud Infrastructure</h4>
                                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Designed scalable solutions using Terraform, reducing deployment time by 60%.</p>
                                </div>
                                <div className="w-full h-px bg-stone-100 dark:bg-stone-800" />
                                <div className="group cursor-pointer">
                                    <h4 className="font-medium text-stone-800 dark:text-stone-200 group-hover:text-amber-600 transition-colors">CI/CD Automation</h4>
                                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Automated pipelines for 50+ microservices using Jenkins and GitLab CI.</p>
                                </div>
                            </div>
                        </SectionCard>

                        {/* Technical Expertise - Moved to Left */}
                        <SectionCard title="Technical Arsenal" icon={<Layers className="w-5 h-5 text-indigo-400" />}>
                            <div className="space-y-4">
                                <SkillGroup label="Cloud Platforms" skills={AUTHOR_INFO.skills.cloud} />
                                <SkillGroup label="DevOps Core" skills={AUTHOR_INFO.skills.devops} />
                                <SkillGroup label="CI / CD" skills={AUTHOR_INFO.skills.cicd} />
                            </div>
                        </SectionCard>
                    </div>

                    {/* Right Column: This Project & Skills */}
                    <div className="space-y-8">

                        {/* About This Project */}
                        <SectionCard
                            title="About This Project"
                            icon={<Sparkles className="w-5 h-5 text-amber-400" />}
                            className="bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-rose-500/10 border-amber-500/30 hover:border-amber-500/50 hover:shadow-amber-500/10 hover:scale-[1.02]"
                        >
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">The Vision</h4>
                                    <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                                        More than just a gallery, this platform acts as a <strong>digital time capsule</strong>. It was crafted with the singular purpose of immortalizing the bond we share, ensuring that every smile, every trip, and every classroom moment remains vivid and accessible for decades to come.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">Key Features</h4>
                                    <ul className="text-sm text-stone-600 dark:text-stone-300 space-y-1.5 list-disc list-inside marker:text-amber-500">
                                        <li><strong>Automated Sync:</strong> Memories updates in real-time from our secure cloud storage.</li>
                                        <li><strong>Smart Caching:</strong> Engineered for lightning-fast performance and instant loads.</li>
                                        <li><strong>Immersive UI:</strong> Features custom "Polaroid" style interactions and fluid animations.</li>
                                        <li><strong>Always Fresh:</strong> The gallery stays up-to-date with our latest shared moments.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-3">Powered By</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <TechBadge name="Next.js 14" type="Framework" />
                                        <TechBadge name="Tailwind CSS" type="Styling" />
                                        <TechBadge name="Framer Motion" type="Animation" />
                                        <TechBadge name="Cloud API" type="CMS / Storage" />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">A Lasting Tribute</h4>
                                    <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                                        We may have left the campus, but the campus never left us. This archive serves as a permanent tribute to our shared laughter, the late-night study sessions, and the unspoken bonds that defined our university life. It stands as a promise that no matter where life takes us, these moments will remain untouched by time.
                                    </p>
                                </div>
                            </div>
                        </SectionCard>



                    </div>
                </div>

                {/* Footer / Connect */}
                <div className="mt-16 flex flex-wrap gap-4 justify-center relative z-10">
                    <a
                        href={AUTHOR_INFO.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group px-6 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <Globe className="w-4 h-4" /> View Full Portfolio
                    </a>
                    <div className="flex gap-2">
                        <SocialLink href={AUTHOR_INFO.contact.github} icon={<Github className="w-5 h-5" />} label="GitHub" />
                        <SocialLink href={AUTHOR_INFO.contact.linkedin} icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
                        <SocialLink href={AUTHOR_INFO.contact.email} icon={<Mail className="w-5 h-5" />} label="Email" />
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- Sub Components ---

function SectionCard({ title, icon, children, className = "" }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200/60 dark:border-stone-800/40 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-200/50 transition-all relative overflow-hidden group ${className}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none transform group-hover:scale-110 duration-500">
                {icon}
            </div>
            <h3 className="text-lg font-serif font-medium text-stone-900 dark:text-white mb-6 flex items-center gap-3">
                {icon} {title}
            </h3>
            {children}
        </div>
    )
}

function TechBadge({ name, type }: { name: string, type: string }) {
    return (
        <div className="bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg border border-stone-100 dark:border-stone-700/50 hover:border-amber-200 dark:hover:border-amber-800 transition-colors cursor-default">
            <div className="font-semibold text-stone-800 dark:text-stone-200">{name}</div>
            <div className="text-[10px] uppercase tracking-wider text-stone-400 mt-0.5">{type}</div>
        </div>
    )
}

function SkillGroup({ label, skills }: { label: string, skills: string[] }) {
    return (
        <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">{label}</h4>
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                    <span key={skill} className="inline-flex px-2.5 py-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-200 transition-all cursor-default">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    )
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-700 hover:shadow-md hover:-translate-y-1 transition-all"
            title={label}
        >
            {icon}
        </a>
    )
}
