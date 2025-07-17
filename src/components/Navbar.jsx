import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Button,
  Icon,
} from '@chakra-ui/react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box bg="#99DDC8" px={4} color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold"></Box>

        <HStack spacing={8} alignItems="center" display={{ base: 'none', md: 'flex' }}>
          <Button >Home</Button>
          <Button >About</Button>
          <Button >Contact</Button>
        </HStack>

        <IconButton
          size="md"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          icon={
            <Icon as={isOpen ? X : Menu} boxSize={5} />   
          }
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            <Button >Home</Button>
            <Button >About</Button>
            <Button >Contact</Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
