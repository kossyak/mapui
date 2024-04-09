export default {
  create(options) {
    const { data, colors, radius, holeSize } = options
    this.canvas = document.createElement('canvas')
    this.canvas.width = radius * 2
    this.canvas.height = radius * 2
    this.ctx = this.canvas.getContext('2d')
    this.stroke = options.stroke ?? 2
    this.radius = radius
    let startAngle = 0
    data.forEach((value, index) => {
      const sliceAngle = 2 * Math.PI * value / Object.values(data).reduce((acc, curr) => acc + curr, 0)
      this.pieSlice(this.radius, startAngle, startAngle + sliceAngle, colors[index%colors.length])
      if (this.stroke) {
        this.ctx.strokeStyle = 'white'
        this.ctx.lineWidth = this.stroke
        this.ctx.stroke()
      }
      startAngle += sliceAngle
    })
    this.pieSlice((holeSize ?? 0.6) * this.radius, 0, 2 * Math.PI, 'white')
    return this.canvas
  },
  pieSlice(radius, startAngle, endAngle, color) {
    const centerX = this.radius
    const centerY = this.radius
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.moveTo(centerX,centerY)
    this.ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    this.ctx.closePath()
    this.ctx.fill()
  }
}