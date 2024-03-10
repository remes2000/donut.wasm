#include <iostream>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#define GLM_ENABLE_EXPERIMENTAL
#include <glm/ext.hpp>
#include <glm/gtx/string_cast.hpp>

int main() {
  glm::vec3 v = glm::vec3(1.0f, 1.0f, 1.0f);
  glm::mat3 m = glm::transpose(glm::mat3(
    -1.0f, -2.0f, 3.0f,
    0.0f, 2.0f, -1.0f,
    -1.0f, 3.0f, 0.0f
  ));
  std::cout << glm::to_string(v * m) << std::endl;
  return 0;
}
