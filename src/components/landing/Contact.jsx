import { useState } from 'react'
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import GlassCard from '../ui/GlassCard.jsx'
import Reveal from '../ui/Reveal.jsx'

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-500'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Contact"
              title="We would love to hear from you"
              subtitle="Questions about the product, feedback on the analyzer, or partnership ideas for hospitals and labs — get in touch."
            />
            <div className="mt-8 space-y-4">
              {[
                { icon: Mail, title: 'Email us', text: 'hello@aimedcheck.example' },
                { icon: MapPin, title: 'Offices', text: 'Remote-first · available worldwide' },
              ].map((c) => (
                <Reveal key={c.title}>
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/20">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{c.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{c.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal>
            <GlassCard className="p-8" hover={false}>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                    Message sent
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                    Thank you, {form.name || 'there'}. We will get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Name
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Jane Doe"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@example.com"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help…"
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/40"
                  >
                    <Send className="h-4 w-4" />
                    Send message
                  </button>
                </form>
              )}
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
