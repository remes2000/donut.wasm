#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <emscripten.h>

struct Quaternion {
  float x;
  float y;
  float z;
  float w;
};

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

void multiply_quaternions(struct Quaternion* l, struct Quaternion* r, struct Quaternion* result) {
  result->w = (l->w * r->w) - (l->x * r->x) - (l->y * r->y) - (l->z * r->z);
  result->x = (l->x * r->w) + (l->w * r->x) + (l->y * r->z) - (l->z * r->y);
  result->y = (l->y * r->w) + (l->w * r->y) + (l->z * r->x) - (l->x * r->z);
  result->z = (l->z * r->w) + (l->w * r->z) + (l->x * r->y) - (l->y * r->x);
}

void multiply_quaternion_by_vector(struct Quaternion* q, float* v, struct Quaternion* result) {
  float x = v[0];
  float y = v[1];
  float z = v[2];

  result->w = - (q->x * x) - (q->y * y) - (q->z * z);
  result->x = (q->w * x) + (q->y * z) - (q->z * y);
  result->y = (q->w * y) + (q->z * x) - (q->x * z);
  result->z = (q->w * z) + (q->x * y) - (q->y * x);
}

void rotate(float* point, float angle, float* axis, float* result) {
  struct Quaternion rotationQ;
  rotationQ.x = axis[0] * sin(angle / 2);
  rotationQ.y = axis[1] * sin(angle / 2);
  rotationQ.z = axis[2] * sin(angle / 2);
  rotationQ.w = cos(angle / 2);

  struct Quaternion conjugateQ;
  conjugateQ.x = -rotationQ.x;
  conjugateQ.y = -rotationQ.y;
  conjugateQ.z = -rotationQ.z;
  conjugateQ.w = rotationQ.w;

  struct Quaternion temp;
  multiply_quaternion_by_vector(&rotationQ, point, &temp);
  struct Quaternion quatResult;
  multiply_quaternions(&temp, &conjugateQ, &quatResult);

  result[0] = quatResult.x;
  result[1] = quatResult.y;
  result[2] = quatResult.z;
}

float dot(float* a, float* b, int length) {
  float sum = 0;
  for (int i = 0; i < length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

EMSCRIPTEN_KEEPALIVE
char* render_frame(float A, float B, float C, float screen_width, float screen_height, float R1, float R2) {
  float theta_spacing = 0.07;
  float phi_spacing = 0.02;
  float K2 = 5.0f;
  float K1 = 30.0f;

  char* output = (char*) malloc(((int) screen_width * (int) screen_height + 1) * sizeof(char));
  float* zbuffer = (float*) malloc((int) screen_width * (int) screen_height * sizeof(float));
  // todo: use memset to set values

  for (int k=0; k < (int) screen_width * (int) screen_height; k++) {
    output[k] = ' ';
    zbuffer[k] = 0;
  }
  output[(int) screen_width * (int) screen_height] = '\0';


  // float rotateXAxis[] = {
  //   1.0f, 0.0f, 0.0f,
  //   0.0f, cos(A), -sin(A),
  //   0.0f, sin(A), cos(A),
  // };
  // float rotateYAxis[] = {
  //   cos(B), 0.0f, sin(B),
  //   0.0f, 1.0f, 0.0f,
  //   -sin(B), 0.0f, cos(B),
  // };
  // float rotateZAxis[] = {
  //   cos(C), -sin(C), 0.0f,
  //   sin(C), cos(C), 0.0f,
  //   0.0f, 0.0f, 1.0f
  // };
  float tranformMatrix[3 * 3] = {
    1.0f, 0.0f, 0.0f,
    0.0f, 1.0f, 0.0f,
    0.0f, 0.0f, 1.0f,
  };
  float partial[3 * 3];

  // multiply(rotateXAxis, rotateYAxis, partial, 3, 3, 3, 3);
  // multiply(partial, rotateZAxis, tranformMatrix, 3, 3, 3, 3);

  for (float theta=0; theta < 2 * M_PI; theta += theta_spacing) {
    for (float phi=0; phi < 2 * M_PI; phi += phi_spacing) {

      float circle[] = { R2 + R1 * cos(theta), R1 * sin(theta), 0.0f };
      float donutRotate[] = {
        cos(phi), 0.0f, sin(phi),
        0.0f, 1.0f, 0.0f,
        -sin(phi), 0.0f, cos(phi)          
      };
      float position[3 * 1];
      multiply(donutRotate, tranformMatrix, partial, 3, 3, 3, 3);
      multiply(circle, partial, position, 1, 3, 3, 3);
      
      float xAxisVector[] = {1.0f, 0.0f, 0.0f};
      float yAxisVector[] = {0.0f, 1.0f, 0.0f};
      float temp2[3 * 1];

      rotate(position, A, xAxisVector, temp2);
      rotate(temp2, B, yAxisVector, position);

      float ooz = 1.0f/(position[2] + K2);
      int xp = (int) (screen_width/2 + K1 * ooz * position[0]);
      int yp = (int) (screen_height/2 - (K1/2) * ooz * position[1]);
      int o = xp + screen_width * yp;

      float normal[3];
      float partialvec[] = { cos(theta), sin(theta), 0.0f };
      multiply(partialvec, partial, normal, 1, 3, 3, 3);
      rotate(normal, A, xAxisVector, partialvec);
      rotate(partialvec, B, yAxisVector, normal);

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

// int main() {
//   char* frame = render_frame(6.28f / 4.0f, 0.0f, 0.0f, 80.0f, 22.0f, 1.0f, 5.0f);
//   printf("%s", frame);
//   free(frame);
//   return 0;
// }
