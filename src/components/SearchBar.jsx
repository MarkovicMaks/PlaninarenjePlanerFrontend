// src/components/SearchBar.jsx
import { Box, Input, Button, InputGroup } from "@chakra-ui/react";
import { Search, X } from "lucide-react";

export default function SearchBar({ 
  value, 
  onChange, 
  onClear, 
  placeholder = "Search...",
  size = "lg" 
}) {
  return (
    <InputGroup>
      <Box position="relative" width="100%">
        <Box
          position="absolute"
          left="12px"
          top="50%"
          transform="translateY(-50%)"
          color="gray.400"
          pointerEvents="none"
        >
          <Search size={18} />
        </Box>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          pl="40px"
          pr={value ? "40px" : "12px"}
          size={size}
        />
        {value && (
          <Button
            position="absolute"
            right="8px"
            top="50%"
            transform="translateY(-50%)"
            size="sm"
            variant="ghost"
            onClick={onClear}
          >
            <X size={18} />
          </Button>
        )}
      </Box>
    </InputGroup>
  );
}