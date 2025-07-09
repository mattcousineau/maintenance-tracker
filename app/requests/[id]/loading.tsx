import { Skeleton } from "@/app/components";
import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";

const request = [1, 2, 3, 4, 5];
const LoadingRequestDetailPage = () => {
  return (
    <Box className="max-w-xl">
      <Heading>
        <Skeleton />
      </Heading>
      <Flex className="space-x-3" my="2">
        <Skeleton width="5rem" />
        <Text>
          <Skeleton width="8rem" />
        </Text>
      </Flex>
      <Card className="prose" mt="4">
        <Skeleton count={3} />
      </Card>
    </Box>
  );
};

export default LoadingRequestDetailPage;
