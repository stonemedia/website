"use client";

import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    const googleFormData = new FormData();
    googleFormData.append("entry.821138598", String(data.get("name") || ""));
    googleFormData.append("entry.2123224421", String(data.get("company") || ""));
    googleFormData.append("entry.425779764", String(data.get("email") || ""));
    googleFormData.append("entry.1432808650", String(data.get("message") || ""));

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSceIYpvfiE2shU_CtC6peCBvu9xHS77qwMXMeQN8HXI7Qv-4Q/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: googleFormData,
        }
      );

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl md:text-3xl uppercase tracking-[0.2em]">
              Let’s build global-ready content.
            </h2>

            <p className="mt-6 max-w-xl text-sm md:text-base text-[#A0A0A0]">
              Share your project scope, languages, and timeline. We’ll respond with a structured next step.
            </p>

            <div className="mt-10 space-y-4 text-xs md:text-sm">
              <div className="flex items-center justify-between gap-6 border-b border-[#1A1A1A] py-3">
                <span className="uppercase tracking-[0.18em] text-[#A0A0A0]">Email</span>
                <a className="hover:text-[#F5F5F5]" href="mailto:info@stonemedia.in">
                  info@stonemedia.in
                </a>
              </div>

              <div className="flex items-center justify-between gap-6 border-b border-[#1A1A1A] py-3">
                <span className="uppercase tracking-[0.18em] text-[#A0A0A0]">Phone</span>
                <a className="hover:text-[#F5F5F5]" href="tel:+919833262742">
                  +91 98332 62742
                </a>
              </div>

              <div className="flex items-center justify-between gap-6 border-b border-[#1A1A1A] py-3">
                <span className="uppercase tracking-[0.18em] text-[#A0A0A0]">WhatsApp</span>
                <a
                  className="hover:text-[#F5F5F5]"
                  href="https://wa.me/919833262742"
                  target="_blank"
                  rel="noreferrer"
                >
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="border border-[#1A1A1A] bg-[#0A0A0A] p-6 md:p-8">
            <div className="grid gap-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">
                  Name
                </label>
                <input
                  name="name"
                  required
                  className="mt-2 w-full border border-[#1A1A1A] bg-[#0D0D0D] px-4 py-3 text-sm outline-none focus:border-[#7A0E14]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">
                  Company
                </label>
                <input
                  name="company"
                  className="mt-2 w-full border border-[#1A1A1A] bg-[#0D0D0D] px-4 py-3 text-sm outline-none focus:border-[#7A0E14]"
                  placeholder="Company / Studio"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full border border-[#1A1A1A] bg-[#0D0D0D] px-4 py-3 text-sm outline-none focus:border-[#7A0E14]"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  className="mt-2 min-h-[140px] w-full resize-none border border-[#1A1A1A] bg-[#0D0D0D] px-4 py-3 text-sm outline-none focus:border-[#7A0E14]"
                  placeholder="Languages, deliverables, deadlines…"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 inline-flex items-center justify-center border border-[#F5F5F5] px-5 py-3 text-sm uppercase tracking-[0.2em] transition-colors hover:border-[#7A0E14] hover:bg-[#7A0E14] disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send Inquiry"}
              </button>

              {status === "sent" && (
                <p className="text-xs text-green-300">
                  Thank you. Your enquiry has been received. Our team will get back to you shortly.
                </p>
              )}

              {status === "error" && (
                <p className="text-xs text-red-300">
                  Something went wrong. Please email us at info@stonemedia.in.
                </p>
              )}
            </div>
          </form>
        </div>

        <footer className="mt-20 border-t border-[#1A1A1A] pt-8 pb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">
              © {new Date().getFullYear()} Stone Media. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">
              <a className="hover:text-[#F5F5F5]" href="#" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="hover:text-[#F5F5F5]" href="#" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}