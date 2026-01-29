import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Button,
  Icon,
  Text,
} from "@chakra-ui/react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@chakra-ui/react";
import { Menu, X, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navButtonStyles = (path) => {
    const active = isActive(path);
    return {
      bg: active ? "#95BF74" : "transparent",
      color: "--deep-gr-txt",
      _hover: {
        bg: "#95BF74",
        color: "--deep-gr-txt",
      },
    };
  };

  return (
    <Box bg="#A3E7D1" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold" fontSize={"3xl"}>
          Hiking Planner
        </Box>

        {/* Desktop nav */}
        <HStack
          as="nav"
          spacing={8}
          alignItems="center"
          display={{ base: "none", md: "flex" }}
        >
          <Button
            as={RouterLink}
            to="/"
            className="NavbarButton"
            {...navButtonStyles("/")}
          >
            Home
          </Button>

          {!loading && (
            <>
              {isAuthenticated ? (
                <>
                  <Button
                    as={RouterLink}
                    to="/trails"
                    className="NavbarButton"
                    {...navButtonStyles("/trails")}
                  >
                    Trails
                  </Button>

                  {/* User Dropdown */}
                  <Box>
                    <MenuRoot>
                      <MenuTrigger asChild>
                        <Button
                          variant="ghost"
                          color="--deep-gr-txt"
                          _hover={{ bg: "#95BF74" }}
                          px={3}
                          py={2}
                        >
                          <HStack spacing={1}>
                            <User size={16} />
                            <Text fontSize="sm" fontWeight="600">
                              {user?.fullName || 'User'}
                            </Text>
                            <ChevronDown size={16} />
                          </HStack>
                        </Button>
                      </MenuTrigger>

                      <MenuContent
                        minW="180px"
                        bg="white"
                        shadow="lg"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        p={1}
                        zIndex={1000}
                        position="fixed"
                        mt="10px"
                      >
                        <MenuItem
                          value="my-trails"
                          onClick={() => navigate('/my-trails')}
                          px={3}
                          py={2}
                          borderRadius="sm"
                          _hover={{ bg: "gray.100" }}
                          cursor="pointer"
                        >
                          <HStack spacing={2} width="100%">
                            <Icon as={Menu} boxSize={4} />
                            <Text fontSize="sm">My Trails</Text>
                          </HStack>
                        </MenuItem>

                        <MenuItem
                          value="profile"
                          onClick={() => navigate('/profile')}
                          px={3}
                          py={2}
                          borderRadius="sm"
                          _hover={{ bg: "gray.100" }}
                          cursor="pointer"
                        >
                          <HStack spacing={2} width="100%">
                            <Settings size={16} />
                            <Text fontSize="sm">Edit Profile</Text>
                          </HStack>
                        </MenuItem>

                        <MenuItem
                          value="logout"
                          onClick={handleLogout}
                          px={3}
                          py={2}
                          borderRadius="sm"
                          _hover={{ bg: "red.50" }}
                          cursor="pointer"
                        >
                          <HStack spacing={2} width="100%">
                            <LogOut size={16} color="#DC2626" />
                            <Text fontSize="sm" color="red.600">Logout</Text>
                          </HStack>
                        </MenuItem>
                      </MenuContent>
                    </MenuRoot>
                  </Box>
                </>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/login"
                    className="NavbarButton"
                    {...navButtonStyles("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/signup"
                    className="NavbarButton"
                    {...navButtonStyles("/signup")}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </>
          )}
        </HStack>

        {/* Mobile menu toggle */}
        <IconButton
          size="md"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          icon={<Icon as={isOpen ? X : Menu} boxSize={5} />}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
      </Flex>

      {/* Mobile nav */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4}>
            <Button
              as={RouterLink}
              to="/"
              {...navButtonStyles("/")}
              onClick={onClose}
            >
              Home
            </Button>

            {!loading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Button
                      as={RouterLink}
                      to="/trails"
                      variant="ghost"
                      {...navButtonStyles("/trails")}
                      onClick={onClose}
                    >
                      Trails
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/my-trails"
                      variant="ghost"
                      {...navButtonStyles("/my-trails")}
                      onClick={onClose}
                    >
                      My Trails
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/profile/edit"
                      variant="ghost"
                      onClick={onClose}
                    >
                      <HStack spacing={2}>
                        <Settings size={16} />
                        <Text>Edit Profile</Text>
                      </HStack>
                    </Button>
                    <Text color={"#FFF"}>Welcome, {user?.fullName}!</Text>
                    <Button
                      leftIcon={<Icon as={LogOut} />}
                      onClick={() => {
                        handleLogout();
                        onClose();
                      }}
                      variant="ghost"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      as={RouterLink}
                      to="/login"
                      variant="ghost"
                      {...navButtonStyles("/login")}
                      onClick={onClose}
                    >
                      Login
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/signup"
                      variant="ghost"
                      {...navButtonStyles("/signup")}
                      onClick={onClose}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}