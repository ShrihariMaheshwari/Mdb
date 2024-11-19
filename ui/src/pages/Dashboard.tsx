import React from 'react';
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Button,
  Text,
  VStack,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
  Icon,
  Progress,
  useColorModeValue
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCollections } from "../hooks/useCollections";
import { useMetrics } from "../hooks/useMetrics";
import { CreateCollectionModal } from "../components/collections/CreateCollectionModal";
import { Database, Users, Files, Clock } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  helpText: string;
  color: string;
  bg: string;
  borderColor: string;
}

interface MetricProgressProps {
  label: string;
  value: number;
  colorScheme: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { collections, loading: collectionsLoading, error: collectionsError, refresh } = useCollections();
  const { metrics, loading: metricsLoading, error: metricsError } = useMetrics();
  
  // Theme values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const listItemBg = useColorModeValue('gray.50', 'gray.700');
  
  // Derived state
  const loading = collectionsLoading || metricsLoading;
  const error = collectionsError || metricsError;

  const totalDocuments = React.useMemo(() => 
    collections?.reduce((acc, col) => acc + col.count, 0) ?? 0,
    [collections]
  );

  const avgDocsPerCollection = React.useMemo(() => 
    collections?.length ? Math.round(totalDocuments / collections.length) : 0,
    [collections, totalDocuments]
  );

  const responseTime = React.useMemo(() => 
    metrics?.queryPerformance?.averageResponseTime
      ? `${metrics.queryPerformance.averageResponseTime.toFixed(1)}ms`
      : 'N/A',
    [metrics]
  );

  if (loading) {
    return (
      <Box p={8}>
        <Progress size="xs" isIndeterminate />
      </Box>
    );
  }

  if (error) {
    return (
      <Card bg={cardBg} p={6}>
        <Heading size="md" color="red.500">Error Loading Dashboard</Heading>
        <Text mt={2}>{error.message}</Text>
        <Button mt={4} onClick={refresh}>Retry</Button>
      </Card>
    );
  }

  return (
    <Box p={6}>
      <HStack mb={8} justify="space-between">
        <Heading size="lg">Database Overview</Heading>
        <Button 
          colorScheme="blue" 
          leftIcon={<Icon as={Database} />} 
          onClick={onOpen}
        >
          New Collection
        </Button>
      </HStack>

      <SimpleGrid columns={[1, 2, 4]} spacing={6} mb={8}>
        <StatCard
          icon={Database}
          label="Collections"
          value={collections?.length ?? 0}
          helpText="Total databases"
          color="purple"
          bg={cardBg}
          borderColor={borderColor}
        />
        <StatCard
          icon={Files}
          label="Documents"
          value={totalDocuments}
          helpText="Across all collections"
          color="blue"
          bg={cardBg}
          borderColor={borderColor}
        />
        <StatCard
          icon={Users}
          label="Avg. Size"
          value={avgDocsPerCollection}
          helpText="Docs per collection"
          color="green"
          bg={cardBg}
          borderColor={borderColor}
        />
        <StatCard
          icon={Clock}
          label="Response Time"
          value={responseTime}
          helpText="Average query time"
          color="orange"
          bg={cardBg}
          borderColor={borderColor}
        />
      </SimpleGrid>

      <SimpleGrid columns={[1, 1, 2]} spacing={8}>
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>Recent Collections</Heading>
            <VStack spacing={4} align="stretch">
              {collections?.slice(0, 5).map(collection => (
                <HStack
                  key={collection.name}
                  p={4}
                  bg={listItemBg}
                  rounded="md"
                  cursor="pointer"
                  _hover={{ bg: hoverBg }}
                  onClick={() => navigate(`/collections/${collection.name}`)}
                >
                  <Icon as={Database} />
                  <Stat>
                    <StatLabel>{collection.name}</StatLabel>
                    <StatNumber fontSize="sm">{collection.count} documents</StatNumber>
                    <StatHelpText>
                      {collection.count > avgDocsPerCollection ? 'Above' : 'Below'} average
                    </StatHelpText>
                  </Stat>
                </HStack>
              ))}
              {collections?.length === 0 && (
                <Text color="gray.500" textAlign="center" py={4}>
                  No collections yet
                </Text>
              )}
            </VStack>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>Database Health</Heading>
            <VStack spacing={6} align="stretch">
              <MetricProgress
                label="Storage Usage"
                value={metrics?.storageUsage?.percentage ?? 0}
                colorScheme={(metrics?.storageUsage?.percentage ?? 0) > 80 ? 'red' : 'blue'}
              />
              <MetricProgress
                label="Query Performance"
                value={metrics?.queryPerformance?.percentage ?? 0}
                colorScheme="green"
              />
              <MetricProgress
                label="Index Coverage"
                value={metrics?.indexCoverage?.percentage ?? 0}
                colorScheme="purple"
              />
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      <CreateCollectionModal
        isOpen={isOpen}
        onClose={onClose}
        onCreate={refresh}
      />
    </Box>
  );
}

const StatCard: React.FC<StatCardProps> = React.memo(({ 
  icon, 
  label, 
  value, 
  helpText, 
  color, 
  bg, 
  borderColor 
}) => (
  <Card bg={bg} borderWidth="1px" borderColor={borderColor}>
    <CardBody>
      <HStack spacing={4}>
        <Icon as={icon} boxSize={8} color={`${color}.500`} />
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber>{value}</StatNumber>
          <StatHelpText>{helpText}</StatHelpText>
        </Stat>
      </HStack>
    </CardBody>
  </Card>
));

const MetricProgress: React.FC<MetricProgressProps> = React.memo(({ 
  label, 
  value, 
  colorScheme 
}) => (
  <Box>
    <HStack justify="space-between" mb={2}>
      <Text>{label}</Text>
      <Text fontWeight="bold">{value}%</Text>
    </HStack>
    <Progress
      value={value}
      colorScheme={colorScheme}
      rounded="full"
      size="sm"
    />
  </Box>
));

export default Dashboard;