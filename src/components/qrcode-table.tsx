import { getTableLink } from '@/lib/utils'
import { toCanvas } from 'qrcode'
import { useEffect, useRef } from 'react'

export default function QrcodeTable({ token, tableNumber }: { token: string; tableNumber: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      toCanvas(
        canvas,
        getTableLink({ token, tableNumber }),
        {
          width: 150
        },
        (error) => {
          if (error) {
            console.error(error.message)
          }
        }
      )
    }
  }, [token, tableNumber])
  return <canvas ref={canvasRef} />
}
