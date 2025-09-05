import { getTableLink } from '@/lib/utils'
import { toCanvas } from 'qrcode'
import { useEffect, useRef } from 'react'

export default function QrcodeTable({
  token,
  tableNumber,
  width = 250
}: {
  token: string
  tableNumber: number
  width?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    canvas.width = width
    canvas.height = width + 50
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = '16px Arial'
    ctx.fillStyle = 'black'
    ctx.fillText(`Bàn ${tableNumber}`, canvas.width / 2.5, canvas.width + 15)
    ctx.fillText('Quét mã QR để gọi món', canvas.width / 6, canvas.width + 35)

    const vitualCanvas = document.createElement('canvas')

    toCanvas(
      vitualCanvas,
      getTableLink({ token, tableNumber }),
      {
        width: width,
        margin: 2
      },
      (error) => {
        if (error) {
          console.error(error.message)
        }

        ctx.drawImage(vitualCanvas, 0, 0, width, width)
      }
    )
  }, [token, tableNumber, width])
  return <canvas ref={canvasRef} />
}
