'use client'

import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'

type SearchParamsLoaderProps = {
  onParamsReceived: (params: ReadonlyURLSearchParams) => void
}

function Suspender(props: SearchParamsLoaderProps) {
  return (
    <Suspense>
      <Suspendent {...props} />
    </Suspense>
  )
}

function Suspendent({ onParamsReceived }: SearchParamsLoaderProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    onParamsReceived(searchParams)
  }, [onParamsReceived, searchParams])

  return null
}

const SearchParamsLoader = React.memo(Suspender)
export default SearchParamsLoader

export const useSearchParamsLoader = () => {
  const [searchParams, setSearchParams] = useState<ReadonlyURLSearchParams | null>(null)
  return { searchParams, setSearchParams }
}
