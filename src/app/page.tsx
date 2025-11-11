'use client'

import Image from "next/image";
import React, {useMemo, useState} from "react";
import { FaGoogle } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function Home() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    industry: "",
    industryOther: "",
    jobTitle: "",
    organisation: "",
    phone: "",
    interest: "",
    agree: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const industryOptions = useMemo(
    () => [
      "Arts",
      "Tourism",
      "Construction",
      "Education",
      "Finance",
      "Healthcare",
      "Hospitality",
      "Manufacturing",
      "Retail",
      "Technology",
      "Transportation",
      "Other",
      "Information Technology",
      "Agency",
    ],
    []
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const {name, value, type} = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "industry" && value !== "Other") {
      setForm((prev) => ({ ...prev, industryOther: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null)
    if (!form.name || !form.email || !form.jobTitle || !form.industry || !form.organisation || !form.phone) {
      setError("Please fill in all required fields.")
      return
    }
    if (form.industry === "Other" && !form.industryOther) {
      setError("Please specify your industry.")
      return
    }
    try {
      setSubmitting(true)
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          industry:
            form.industry === "Other" && form.industryOther
              ? form.industryOther
              : form.industry,
          jobTitle: form.jobTitle,
          organisation: form.organisation,
          phone: form.phone,
          interest: form.interest,
          agree: form.agree,
        }),
      })
      if (res.status === 409) {
        setError("This email has already signed up.")
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.message || "Something went wrong. Please try again.")
        return
      }
      router.push("/success")
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className='min-h-screen bg-[#FFF3F7] flex flex-col'>
      <div className="max-w-[370px] md:max-w-2xl mx-auto mt-2 p-6 border border-black/20 
                    rounded-sm shadow-xl bg-[#F2F6FA]">
                      {/*title*/}
                      <div className="flex flex-col items-center justify-center text-center gap-3 mb-10">
                        <h1 className="font-extrabold text-[28px] md:text-[35px] leading-[120%] tracking-[-0.05em] ">
                        <span className="text-brand">Presignup:</span>
                        <br/>
                        <div className="text-[28px] mt-2">
                          The KAT Digital Pass<span className="text-brand ">.</span>
                        </div>
                        </h1>
                        <p className="font-normal text-[13px] md:text-[15px] leading-[150%] tracking-[-0.03em] max-w-sm">
                            Fast, secure signup to receive early product updates and platform access.
                        </p>
                        
                    </div>
                    {/*signup form*/}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/*fullname*/}
                      <div>
                            <label className="block text-[18px] md:text-xl font-bold leading-[150%] tracking-[0.03em] mb-1"> 
                                Full Name<span className="text-brand">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="italic font-normal text-[15px] leading-[150%] tracking-[0.03em] w-full rounded-sm 
                                border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 
                                focus:ring-brand bg-white text-[#8E8E8E]"
                            />
                        </div>
                        {/*Email*/}
                        <div>
                            <label className="block text-[18px] md:text-xl font-bold leading-[150%] tracking-[0.03em] mb-1"> 
                                Email<span className="text-brand">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="italic font-normal text-[15px] leading-[150%] tracking-[0.03em] w-full 
                                rounded-sm border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand 
                                bg-white text-[#8E8E8E]"
                            />
                        </div>
                        {/*Phone*/}
                        <div>
                            <label className="block text-[18px] md:text-xl font-bold leading-[150%] tracking-[0.03em] mb-1"> 
                                Phone number<span className="text-brand">*</span>
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Include country code if possible"
                                className="italic font-normal text-[15px] leading-[150%] tracking-[0.03em] w-full 
                                rounded-sm border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand 
                                bg-white text-[#8E8E8E]"
                            />
                        </div>
                        {/*Organisation*/}
                        <div>
                            <label className="block text-[18px] md:text-xl font-bold leading-[150%] tracking-[0.03em] mb-1"> 
                                Organisation<span className="text-brand">*</span>
                            </label>
                            <input
                                type="text"
                                name="organisation"
                                value={form.organisation}
                                onChange={handleChange}
                                placeholder="Company or organisation name"
                                className="italic font-normal text-[15px] leading-[150%] tracking-[0.03em] w-full 
                                rounded-sm border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand 
                                bg-white text-[#8E8E8E]"
                            />
                        </div>
                        {/*Industry*/}
                        <div>
                            <label className="block text-[18px] md:text-xl font-bold leading-[150%] tracking-[0.03em] mb-1"> 
                                Industry sector<span className="text-brand">*</span>
                            </label>
                            <select
                                name="industry"
                                value={form.industry}
                                onChange={handleChange}
                                className="italic font-normal text-[15px] leading-[150%] tracking-[0.03em] w-full 
                                rounded-sm border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand 
                                bg-white text-[#8E8E8E]"
                            >
                                <option value="">Select your industry</option>
                                {industryOptions.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        {form.industry === "Other" && (
                          <div>
                            <label className="block text-[16px] md:text-lg font-semibold leading-[150%] tracking-[0.03em] mb-1"> 
                                Specify your industry
                            </label>
                            <input
                                type="text"
                                name="industryOther"
                                value={form.industryOther}
                                onChange={handleChange}
                                placeholder="e.g., Non-profit, Government, etc."
                                className="italic font-normal text-[15px] leading-[150%] tracking-[0.03em] w-full 
                                rounded-sm border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand 
                                bg-white text-[#8E8E8E]"
                            />
                          </div>
                        )}
                        {/*Job title*/}
                        <div>
                            <label className="block text-[18px] md:text-xl font-bold leading-[150%] tracking-[0.03em] mb-1"> 
                                Job title<span className="text-brand">*</span>
                            </label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={form.jobTitle}
                                onChange={handleChange}
                                placeholder="e.g., Operations Manager"
                                className="italic font-normal text-[15px] leading-[150%] tracking-[0.03em] w-full 
                                rounded-sm border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand 
                                bg-white text-[#8E8E8E]"
                            />
                        </div>
                        {/*Interest (optional)*/}
                        <div>
                            <label className="block text-[18px] md:text-xl font-bold leading-[150%] tracking-[0.03em] mb-1"> 
                                Why you&apos;re interested <span className="text-sm text-gray-500">(Optional)</span>
                            </label>
                            <textarea
                                name="interest"
                                value={form.interest}
                                onChange={handleChange}
                                placeholder="Tell us why you're excited about our product"
                                rows={4}
                                className="italic font-normal text-[15px] leading-[150%] tracking-[0.03em] w-full 
                                rounded-sm border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand 
                                bg-white text-[#8E8E8E]"
                            />
                        </div>
                        {/*terms & conditions*/}
                        <div className="mt-10 flex items-start gap-2 text-sm">
                            <input
                                type="checkbox"
                                name="agree"
                                checked={form.agree}
                                onChange={handleChange}
                                className="translate-y-1 h-4 w-4 border border-black/20"
                                required
                            />
                            <p className="font-normal text-[12px] md:text-[14px] leading-[180%] tracking-[-0.03em] text-black/70 max-w-[300px] md:max-w-[900px]">
                                By signing up you agree to our {" "}
                                <a href="https://katmarketing.co.uk/privacy-policy" className="font-semibold underline">
                                    Privacy Policy
                                </a>.
                            </p>
                        </div>
                        {error && (
                          <div className="text-red-600 text-sm">{error}</div>
                        )}
                        {/*sign up button*/}
                        <div className="mt-10">
                          <button type="submit" className="btn btn-primary w-full cursor-pointer disabled:opacity-60" disabled={submitting}>
                              {submitting ? "Submitting..." : "Sign up"}
                          </button>
                        </div>
                    </form>

      </div>
    </div>
  );
}
