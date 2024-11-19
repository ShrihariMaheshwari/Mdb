// src/components/query/QueryBuilder.tsx
import { useState } from 'react';
import {
 Box,
 Button,
 Select,
 Input,
 VStack,
 HStack,
 IconButton,
 Text,
 useToast
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { QueryFilter } from '../../types';

interface QueryBuilderProps {
 onQuery: (filter: QueryFilter) => void;
}

interface Condition {
 field: string;
 operator: string;
 value: string;
}

export function QueryBuilder({ onQuery }: QueryBuilderProps) {
 const [conditions, setConditions] = useState<Condition[]>([
   { field: '', operator: '$eq', value: '' }
 ]);
 
 const toast = useToast();

 const operators = [
   { value: '$eq', label: 'Equals' },
   { value: '$ne', label: 'Not Equals' },
   { value: '$gt', label: 'Greater Than' },
   { value: '$gte', label: 'Greater Than or Equal' },
   { value: '$lt', label: 'Less Than' },
   { value: '$lte', label: 'Less Than or Equal' },
   { value: '$in', label: 'In' },
   { value: '$nin', label: 'Not In' },
   { value: '$regex', label: 'Matches Regex' }
 ];

 const updateCondition = (index: number, field: keyof Condition, value: string) => {
   const updated = [...conditions];
   updated[index] = { ...updated[index], [field]: value };
   setConditions(updated);
 };

 const addCondition = () => {
   setConditions([...conditions, { field: '', operator: '$eq', value: '' }]);
 };

 const removeCondition = (index: number) => {
   if (conditions.length > 1) {
     setConditions(conditions.filter((_, i) => i !== index));
   }
 };

 const handleSearch = () => {
   try {
     const filter = conditions.reduce((acc, condition) => {
       if (condition.field && condition.value) {
         let value: any = condition.value;
         
         // Handle numeric values for comparison operators
         if (['$gt', '$gte', '$lt', '$lte'].includes(condition.operator)) {
           const numValue = Number(value);
           if (isNaN(numValue)) {
             throw new Error(`Value for ${condition.field} must be a number`);
           }
           value = numValue;
         }
         
         // Handle array values for $in and $nin
         if (['$in', '$nin'].includes(condition.operator)) {
           try {
             const parsedValue = JSON.parse(value);
             if (!Array.isArray(parsedValue)) {
               throw new Error();
             }
             value = parsedValue;
           } catch {
             throw new Error(`Value for ${condition.field} must be a valid array (e.g., [1,2,3])`);
           }
         }

         acc[condition.field] = { [condition.operator]: value };
       }
       return acc;
     }, {} as QueryFilter);

     onQuery(filter);
   } catch (err) {
     const errorMessage = err instanceof Error ? err.message : 'Invalid query';
     toast({
       title: 'Invalid Query',
       description: errorMessage,
       status: 'error',
       duration: 3000,
       isClosable: true,
       position: 'top'
     });
   }
 };

 return (
   <Box p={4} bg="gray.50" borderRadius="md" mb={6}>
     <Text mb={4} fontWeight="bold">Query Builder</Text>
     <VStack spacing={4} align="stretch">
       {conditions.map((condition, index) => (
         <HStack key={index} spacing={4}>
           <Input
             placeholder="Field name"
             value={condition.field}
             onChange={(e) => updateCondition(index, 'field', e.target.value)}
           />
           <Select
             value={condition.operator}
             onChange={(e) => updateCondition(index, 'operator', e.target.value)}
           >
             {operators.map(op => (
               <option key={op.value} value={op.value}>
                 {op.label}
               </option>
             ))}
           </Select>
           <Input
             placeholder="Value"
             value={condition.value}
             onChange={(e) => updateCondition(index, 'value', e.target.value)}
           />
           <IconButton
             aria-label="Remove condition"
             icon={<DeleteIcon />}
             onClick={() => removeCondition(index)}
             isDisabled={conditions.length === 1}
             colorScheme="red"
             variant="ghost"
           />
         </HStack>
       ))}
     </VStack>

     <HStack mt={4} spacing={4}>
       <Button
         leftIcon={<AddIcon />}
         onClick={addCondition}
         size="sm"
       >
         Add Condition
       </Button>
       <Button
         colorScheme="blue"
         onClick={handleSearch}
         size="sm"
       >
         Search
       </Button>
     </HStack>
   </Box>
 );
}

export default QueryBuilder;