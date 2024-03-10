#include <iostream>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>


void render_frame(float A, float B, float C);
int main() {
  render_frame(6.28f / 4.0f, 0.0f, 0.0f);
  return 0;
}

void render_frame(float A, float B, float C) {
  float screen_width = 80;
  float screen_height = 22;
  float theta_spacing = 0.07;
  float phi_spacing = 0.02;
  float R1 = 1.0f;
  float R2 = 2.0f;
  float K2 = 5.0f;
  float K1 = 30.0f;

  char output[(int) screen_width * (int) screen_height];
  float zbuffer[(int) screen_width * (int) screen_height];

  for (int k=0; k < (int) screen_width * (int) screen_height; k++) {
    output[k] = ' ';
    zbuffer[k] = 0;
  }

  for (float theta=0; theta < 2 * M_PI; theta += theta_spacing) {
    for (float phi=0; phi < 2 * M_PI; phi += phi_spacing) {

      glm::vec3 circle = glm::vec3(R2 + R1 * cos(theta), R1 * sin(theta), 0.0f);
      glm::mat3 donutRotate = glm::transpose(glm::mat3(
        cos(phi), 0.0f, sin(phi),
        0.0f, 1.0f, 0.0f,
        -sin(phi), 0.0f, cos(phi)
      ));
      glm::mat3 rotateXAxis = glm::transpose(glm::mat3(
        1.0f, 0.0f, 0.0f,
        0.0f, cos(A), -sin(A),
        0.0f, sin(A), cos(A)
      ));
      glm::mat3 rotateYAxis = glm::transpose(glm::mat3(
        cos(B), 0.0f, sin(B),
        0.0f, 1.0f, 0.0f,
        -sin(B), 0.0f, cos(B)
      ));
      glm::mat3 rotateZxis = glm::transpose(glm::mat3(
        cos(C), -sin(C), 0.0f,
        sin(C), cos(C), 0.0f,
        0.0f, 0.0f, 1.0f
      ));

      glm::vec3 position = circle * donutRotate * rotateXAxis * rotateYAxis * rotateZxis;

      float ooz = 1.0f/(position.z + K2);
      int xp = (int) (screen_width/2 + K1 * ooz * position.x);
      int yp = (int) (screen_height/2 - (K1/2) * ooz * position.y);
      int o = xp + screen_width * yp;

      float L = glm::dot(
        glm::vec3(cos(theta), sin(theta), 0.0f) * donutRotate * rotateXAxis * rotateYAxis * rotateZxis,
        glm::vec3(0.0f, 1.0f, -1.0f)
      );
      
      if(yp<screen_height && yp>=0 && xp<screen_width && xp>=0 && ooz > zbuffer[o]) {
        zbuffer[o] = ooz;
        int luminance_index = L*8;
        output[o] = ".,-~:;=!*#$@"[luminance_index > 0 ? luminance_index : 0];
      }
    }
  }

  std::cout << "This is my donut" << std::endl;
  for(int i = 0; i < (int) screen_width * (int) screen_height; i++) {
    if (i % (int) screen_width == 0) {
      std::cout << std::endl;
    }
    std::cout << output[i];
  }
  std::cout << std::endl;
}