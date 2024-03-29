#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <emscripten.h>

void multiply(float* mat1, float* mat2, float* result, int rows1, int cols1, int rows2, int cols2) {
  for (int i = 0; i < rows1; i++) {
    for (int j = 0; j < cols2; j++) {
      result[i * cols2 + j] = 0;
      for (int k = 0; k < cols1; k++) {
        result[i * cols2 + j] += mat1[i * cols1 + k] * mat2[k * cols2 + j];
      }
    }
  }
}

float dot(float* a, float* b, int length) {
  float sum = 0;
  for (int i = 0; i < length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

EMSCRIPTEN_KEEPALIVE
void rotate(float* rotationAccumulator, float xRotateAngle, float yRotateAngle, float* result) {
  float partial[3 * 3];
  float rotateXAxis[] = {
    1.0f, 0.0f, 0.0f,
    0.0f, cos(xRotateAngle), -sin(xRotateAngle),
    0.0f, sin(xRotateAngle), cos(xRotateAngle),
  };
  float rotateYAxis[] = {
    cos(yRotateAngle), 0.0f, sin(yRotateAngle),
    0.0f, 1.0f, 0.0f,
    -sin(yRotateAngle), 0.0f, cos(yRotateAngle),
  };
  multiply(rotationAccumulator, rotateXAxis, partial, 3, 3, 3, 3);
  multiply(partial, rotateYAxis, result, 3, 3, 3, 3);
}

EMSCRIPTEN_KEEPALIVE
char* render_frame(float* rotationAccumulator, float screen_width, float screen_height, float R1, float R2, float distance) {
  float aspect_ratio = screen_width / screen_height;
  float theta_spacing = 0.07;
  float phi_spacing = 0.02;
  float d = 1.0f / tan(6.28f / 4.0f / 2.0f);
  float K1 = 30.0f;

  char* output = (char*) malloc(((int) screen_width * (int) screen_height + 1) * sizeof(char));
  float* zbuffer = (float*) malloc((int) screen_width * (int) screen_height * sizeof(float));
  // todo: use memset to set values

  for (int k=0; k < (int) screen_width * (int) screen_height; k++) {
    output[k] = ' ';
    zbuffer[k] = 0;
  }
  output[(int) screen_width * (int) screen_height] = '\0';

  float partial[3 * 3];

  for (float theta=0; theta < 2 * M_PI; theta += theta_spacing) {
    for (float phi=0; phi < 2 * M_PI; phi += phi_spacing) {

      float circle[] = { R2 + R1 * cos(theta), R1 * sin(theta), 0.0f };
      float donutRotate[] = {
        cos(phi), 0.0f, sin(phi),
        0.0f, 1.0f, 0.0f,
        -sin(phi), 0.0f, cos(phi)          
      };
      float position[3 * 1];
      multiply(donutRotate, rotationAccumulator, partial, 3, 3, 3, 3);
      multiply(circle, partial, position, 1, 3, 3, 3);

      float z = position[2] + distance;
      float ooz = 1.0f/z;
      int xp = (int) (screen_width/2 + K1 * ooz * position[0]);
      int yp = (int) (screen_height/2 - (K1/2) * ooz * position[1]);
      int o = xp + screen_width * yp;

      float normal[3];
      float partialvec[] = { cos(theta), sin(theta), 0.0f };
      multiply(partialvec, partial, normal, 1, 3, 3, 3);

      float light[] = { 0.0f, 1.0f, -1.0f };

      float L = dot(normal, light, 3);
      
      if(yp<screen_height && yp>=0 && xp<screen_width && xp>=0 && ooz > zbuffer[o]) {
        zbuffer[o] = ooz;
        int luminance_index = L*8;
        output[o] = ".,-~:;=!*#$@"[luminance_index > 0 ? luminance_index : 0];
      }
    }
  }
  free(zbuffer);

  return output;
}

EMSCRIPTEN_KEEPALIVE
void wasmfree(void *ptr) {
  free(ptr);
}

EMSCRIPTEN_KEEPALIVE
void* wasmallocate(int number_of_bytes) {
  return malloc(number_of_bytes);
}
