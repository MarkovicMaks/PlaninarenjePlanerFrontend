import { Slider } from "@chakra-ui/react";
function LengthSlider() {
  return (
    <Slider.Root>
      <div>
        <Slider.Label>Daljina puta</Slider.Label>
        <Slider.ValueText />
      </div>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb>
          <Slider.DraggingIndicator />
        </Slider.Thumb>
        <Slider.MarkerGroup>
          <Slider.Marker />
        </Slider.MarkerGroup>
      </Slider.Control>
    </Slider.Root>
  );
}

export default LengthSlider;
