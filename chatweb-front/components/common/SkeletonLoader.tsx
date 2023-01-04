import { Skeleton } from '@chakra-ui/react';
import * as React from 'react';

interface ISkeletonLoaderProps {
    count: number;
    width?: string;
    height: string;
}

const SkeletonLoader: React.FC<ISkeletonLoaderProps> = ({ count, width, height }) => {
    return (
        <>
            {...Array(count).fill(0).map((_, i) => (
                <Skeleton key={i}
                    startColor="yellow.400"
                    endColor="yellow.600"
                    height={height}
                    width={{ base: "full" }} />
            ))}
        </>
    );
};

export default SkeletonLoader;
