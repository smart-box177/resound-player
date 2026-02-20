import { ThemedText } from '@/components/themed-text';
import { StyleSheet, TouchableOpacity } from 'react-native';

type FilterChipProps = {
    label: string;
    isSelected?: boolean;
    onPress?: () => void;
};

export function FilterChip({ label, isSelected, onPress }: FilterChipProps) {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                isSelected && styles.selectedContainer,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <ThemedText style={[styles.text, isSelected && styles.selectedText]}>
                {label}
            </ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#252525',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedContainer: {
        backgroundColor: '#D7FC70', // Lime/Green accent from design
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        color: '#AAA',
    },
    selectedText: {
        color: '#000',
        fontWeight: '600',
    },
});
