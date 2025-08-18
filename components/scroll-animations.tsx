"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  animation?: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleIn"
  delay?: number
}

export default function ScrollAnimation({
  children,
  className = "",
  animation = "fadeInUp",
  delay = 0,
}: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-in")
          }, delay)
        }
      },
      { threshold: 0.1 },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getAnimationClass = () => {
    switch (animation) {
      case "fadeInUp":
        return "opacity-0 translate-y-8 transition-all duration-700 ease-out"
      case "fadeInLeft":
        return "opacity-0 -translate-x-8 transition-all duration-700 ease-out"
      case "fadeInRight":
        return "opacity-0 translate-x-8 transition-all duration-700 ease-out"
      case "scaleIn":
        return "opacity-0 scale-95 transition-all duration-700 ease-out"
      default:
        return "opacity-0 translate-y-8 transition-all duration-700 ease-out"
    }
  }

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
