import { Container, Title, Text } from '@mantine/core';

export function SobrePage() {
  return (
    <Container>
      <Title order={2} my="md">Sobre o Cuidar+</Title>
      <Text>
        Este aplicativo fornece orientações em vídeo para cuidados pós-cirúrgicos. 
        As informações aqui apresentadas têm caráter educativo e não substituem a avaliação de um profissional de saúde.
      </Text>
      <Text mt="sm">
        Em caso de dor intensa, febre, mau cheiro ou sangramento, procure atendimento médico imediatamente.
      </Text>
    </Container>
  );
}
