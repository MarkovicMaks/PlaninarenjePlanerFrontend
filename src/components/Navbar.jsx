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
import { Menu, X, LogOut } from "lucide-react";
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
                  <Button
                    as={RouterLink}
                    to="/my-trails"
                    className="NavbarButton"
                    {...navButtonStyles("/my-trails")}
                  >
                    My Trails
                  </Button>
                  <Text color={"--deep-gr-txt"} fontWeight={"600"}>Welcome {user?.fullName}!</Text>
                  <Button
                    leftIcon={<Icon as={LogOut} />}
                    onClick={handleLogout}
                    className="NavbarButton"
                    variant="outline"
                  >
                    Logout
                  </Button>
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
                    <Text color={"#FFF"} >Welcome, {user?.fullName}!</Text>
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
