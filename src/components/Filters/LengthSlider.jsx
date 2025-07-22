import { Slider } from "@chakra-ui/react";
function LengthSlider() {
  return (
    <Slider.Root margin={4} defaultValue={[10]} min={1} max={50}>
      <div>
        <Slider.Label>Daljina puta </Slider.Label>
        <Slider.ValueText />
        <Slider.Label>km</Slider.Label>
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
