'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CardData } from '@/types/card'
import CardActions from './CardActions'

interface CardProps {
  data: CardData
}

export default function Card({ data }: CardProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false)

  return (
    <>
      <article className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300">
        {/* Author Info */}
        {data.authorName && (
          <div className="px-5 pt-4 pb-2">
            <Link 
              href={`/profile/${data.authorId}`}
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {data.authorAvatar && (
                <Image
                  src={data.authorAvatar}
                  alt={data.authorName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <button className="text-primary font-semibold text-sm hover:text-violet-600 transition-colors">
                {data.authorName}
              </button>
            </Link>
          </div>
        )}

        {/* Image */}
        {data.image && (
          <div 
            className="relative w-full h-52 overflow-hidden cursor-pointer"
            onClick={() => setImageModalOpen(true)}
          >
            <Image
              src={data.image}
              alt={data.title ?? 'Post image'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 680px"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>
        )}

        {/* Body */}
        <div className="p-5">
          {/* Title */}
          {data.title && (
            <h2 className="text-primary font-semibold text-lg leading-snug mb-2 group-hover:text-violet-600 transition-colors duration-200">
              {data.title}
            </h2>
          )}

          {/* Description */}
          {data.description && (
            <p className="text-secondary text-sm leading-relaxed line-clamp-3">
              {data.description}
            </p>
          )}

          {/* Actions */}
          <div className="mt-4">
            <CardActions likes={data.likes} postId={data.id} />
          </div>
        </div>
      </article>

      {/* Image Modal */}
      {imageModalOpen && data.image && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={data.image}
              alt={data.title ?? 'Post image'}
              width={1000}
              height={563}
              className="w-full h-auto rounded-2xl object-contain"
              priority
            />
            {/* Close button */}
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close image"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
