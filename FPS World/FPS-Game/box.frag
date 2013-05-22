#version 330 core

uniform mat4 model;
uniform sampler2D tex;

uniform struct Light {
   vec3 position;
   vec3 intensities; // the color of the light
} light;

in vec2 fragTexCoord;
in vec3 fragNormal;
in vec3 fragVert;

out vec4 finalColor;

void main()
{
	//calculate normal in world coordinates
    mat3 normalMatrix = transpose(inverse(mat3(model)));
    vec3 normal = normalize(normalMatrix * fragNormal);
    
    //calculate the location of this fragment (pixel) in world coordinates
    vec3 fragPosition = vec3(model * vec4(fragVert, 1));
    
    //calculate the vector from this pixels surface to the light source
    vec3 surfaceToLight = light.position - fragPosition;

    //calculate the cosine of the angle of incidence
    float brightness = dot(normal, surfaceToLight) / (length(surfaceToLight) * length(normal));
    brightness = clamp(brightness, 0, 1);

    //calculate final color of the pixel, based on:
    // 1. The angle of incidence: brightness
    // 2. The color/intensities of the light: light.intensities
    finalColor = brightness * vec4(light.intensities, 1) * texture(tex, fragTexCoord);
}