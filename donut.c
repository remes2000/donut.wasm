#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>

float screen_width = 80;
float screen_height = 22;
float theta_spacing = 0.07;
float phi_spacing = 0.02;
float R1 = 1;
float R2 = 2;
float K2 = 5;

void render_frame(float A, float B);
int main() {
  render_frame(0.0f, 0.0f);
  return 0;
}

void render_frame(float A, float B) {
  int calc = 0;
  int iter = 0;
  // float K1 = screen_width * K2 * 3 / (8 * (R1+R2));
  // todo: restore the previous version
  float K1 = 30;
  float cosA = cos(A), sinA = sin(A);
  float cosB = cos(B), sinB = sin(B);

  // todo: null termination
  char* output = (char*) malloc(screen_width * screen_height * sizeof(char));
  float* zbuffer = (float*) malloc(screen_width * screen_height * sizeof(float));
  memset(output, 32, screen_width * screen_height * sizeof(char));
  memset(zbuffer, 0, screen_width * screen_height * sizeof(float));

  for (float theta=0; theta < 2 * M_PI; theta += theta_spacing) {
    float costheta = cos(theta), sintheta = sin(theta);
    for (float phi=0; phi < 2 * M_PI; phi += phi_spacing) {
      iter++;
      float cosphi = cos(phi), sinphi = sin(phi);

      float circlex = R2 + R1 * costheta;
      float circley = R1 * sintheta;

      // TODO: copied from the example code, should implement mine solution with matrix multiplication
      // final 3D (x,y,z) coordinate after rotations, directly from
      // our math above
      float x = circlex*(cosB*cosphi + sinA*sinB*sinphi) - circley*cosA*sinB; 
      // float y = circlex*(sinB*cosphi - sinA*cosB*sinphi) + circley*cosA*cosB;
      float y = circlex * (sinB*cosphi) + (sinphi * circlex * cosA - sintheta * sinA) * cosB;
      float z = (K2 + (sinA * circlex * sinphi) + (circley * cosA));
      float ooz = 1/z;  // "one over z"

      // projection
      int xp = (int) (screen_width/2 + K1 * ooz * x);
      int yp = (int) (screen_height/2 - (K1 / 2) * ooz * y);
      if (xp >= screen_width  || xp < 0 || yp >= screen_height || yp < 0) {
        continue;
      }

      // calculate luminance.  ugly, but correct.
      // float L = cosphi*costheta*sinB - cosA*costheta*sinphi - sinA*sintheta + cosB*(cosA*sintheta - costheta*sinA*sinphi);
      float L = (sintheta*sinA-sinphi*costheta*cosA)*cosB-sinphi*costheta*sinA-sintheta*cosA-cosphi*costheta*sinB;

      int o = yp * screen_width + xp;
      if (ooz > zbuffer[o]) {
        zbuffer[o] = ooz;
        int luminance_index = L*8;
        output[o] = ".,-~:;=!*#$@"[luminance_index > 0 ? luminance_index : 0];
      }
    }
  }

  for (int k = 0; k < screen_width * screen_height; k++) {
    putchar(k % 80 ? output[k] : 10);
  }
  printf("\n");

  free(output);
  free(zbuffer);
}
