'use client'
import React,{JSX} from "react"

const SuccessPage: React.FC = (): JSX.Element => {
    return (
        <div className="min-h-screen bg-[#FFF3F7] flex flex-col">
            <div className="max-w-[700px] mx-auto mt-20 p-8 border border-black/20 rounded-sm shadow-xl bg-[#F2F6FA] text-center">
                <h1 className="font-extrabold text-[28px] md:text-[40px] leading-[120%] tracking-[-0.05em] mb-3">
                    You're on the waiting list<span className="text-brand">!</span>
                </h1>
                <p className="font-normal text-[14px] md:text-[16px] leading-[160%] tracking-[-0.02em] text-black/80">
                    Thank you for signing up. We&apos;ll send product updates to you once we launch.
                </p>
            </div>
        </div>
    )
}

export default SuccessPage;