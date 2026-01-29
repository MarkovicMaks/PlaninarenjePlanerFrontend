// src/components/Trails/DeleteTrailModal.jsx
import { createPortal } from "react-dom";
import { Box, Button, VStack, Text, HStack } from "@chakra-ui/react";
import { AlertTriangle } from "lucide-react";

export default function DeleteTrailModal({ isOpen, onClose, onConfirm, trailName }) {
  if (!isOpen) return null;

  return createPortal(
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
      onClick={onClose}
    >
      <Box
        bg="white"
        borderRadius="md"
        p={6}
        maxW="450px"
        w="90%"
        boxShadow="2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <VStack align="stretch" spacing={4}>
          {/* Header with warning icon */}
          <HStack spacing={3}>
            <Box color="red.500">
              <AlertTriangle size={24} />
            </Box>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Delete Trail
            </Text>
          </HStack>

          {/* Warning message */}
          <VStack align="stretch" spacing={2}>
            <Text color="gray.700">
              Are you sure you want to delete{" "}
              <Text as="span" fontWeight="bold">
                "{trailName}"
              </Text>
              ?
            </Text>
            <Text fontSize="sm" color="red.600">
              This action cannot be undone. All data associated with this trail will be permanently deleted.
            </Text>
          </VStack>

          {/* Action buttons */}
          <HStack justify="flex-end" spacing={3} pt={2}>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Delete Trail
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>,
    document.body
  );
}