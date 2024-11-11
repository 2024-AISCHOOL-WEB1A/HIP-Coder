import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageButton, currentPage === i && styles.activePageButton]}
          onPress={() => onPageChange(i)}
          disabled={isLoading}
        >
          <Text
            style={[styles.pageButtonText, currentPage === i && styles.activePageButtonText]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return pages;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navigationButton, currentPage === 1 && styles.disabledButton]}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        <Text style={styles.navigationButtonText}>이전</Text>
      </TouchableOpacity>

      <View style={styles.pageNumbersContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#9C59B5" />
        ) : (
          renderPageNumbers()
        )}
      </View>

      <TouchableOpacity
        style={[styles.navigationButton, currentPage === totalPages && styles.disabledButton]}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        <Text style={styles.navigationButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0E6F5',
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activePageButton: {
    backgroundColor: '#9C59B5',
    borderColor: '#9C59B5',
  },
  pageButtonText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Pretendard-Regular',
  },
  activePageButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium', 
  },
  navigationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navigationButtonText: {
    color: '#9C59B5',
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Pagination;
