mandelcube
==========
`
For each pixel (Px, Py) on the screen, do:
{
  x0 = scaled x coordinate of pixel (scaled to lie in the Mandelbrot X scale (-2.5, 1))
  y0 = scaled y coordinate of pixel (scaled to lie in the Mandelbrot Y scale (-1, 1))
  x = 0.0
  y = 0.0
  iteration = 0
  max_iteration = 1000
  // Here N=2^8 is chosen as a reasonable bailout radius.
  while ( x*x + y*y < (1 << 16)  AND  iteration < max_iteration ) {
    xtemp = x*x - y*y + x0
    y = 2*x*y + y0
    x = xtemp
    iteration = iteration + 1
  }
  // Used to avoid floating point issues with points inside the set.
  if ( iteration < max_iteration ) {
    zn = sqrt( x*x + y*y )
    nu = log( log(zn) / log(2) ) / log(2)
    // Rearranging the potential function.
    // Could remove the sqrt and multiply log(zn) by 1/2, but less clear.
    // Dividing log(zn) by log(2) instead of log(N = 1<<8)
    // because we want the entire palette to range from the
    // center to radius 2, NOT our bailout radius.
    iteration = iteration + 1 - nu
  }
  color1 = palette[floor(iteration)]
  color2 = palette[floor(iteration) + 1]
  // iteration % 1 = fractional part of iteration.
  color = linear_interpolate(color1, color2, iteration % 1)
  plot(Px, Py, color)
}
`