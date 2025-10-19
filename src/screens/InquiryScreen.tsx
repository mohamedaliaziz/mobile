import React, { useRef, useEffect } from 'react'; // ✅ أضف useRef, useEffect
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Hooks and Components
import { useInquiry } from '../hooks/useInquiry';
import { TransferStatus } from '../components/TransferStatus';
import { DocumentList } from '../components/DocumentList';

// Styles
import { commonStyles, componentStyles, colors, typography } from '../styles';

export default function InquiryScreen() {
  const {
    reference,
    setReference,
    loading,
    transferData,
    documents,
    handleLookup,
    openDocument,
  } = useInquiry();

  // ✅ إضافة useRef للـ TextInput
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // ✅ تركيز على الـ input عند فتح الشاشة إذا كان فيه reference
    if (reference && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        // ✅ عمل استعلام تلقائي إذا كان فيه reference
        handleLookup(reference);
      }, 800);
    }
  }, [reference]);

  const handleSubmit = () => {
    handleLookup();
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        contentContainerStyle={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={componentStyles.inquiry.header}>
          <Ionicons name="search" size={32} color={colors.primary[500]} />
          <Text style={componentStyles.inquiry.title}>الاستعلام عن المعاملة</Text>
        </View>

        {/* Search Section */}
        <View style={componentStyles.inquiry.searchSection}>
          <TextInput
            ref={inputRef} // ✅ إضافة الـ ref
            value={reference}
            onChangeText={setReference}
            placeholder="أدخل مرجع المعاملة (مثل: T2510141602-0ATY)"
            style={componentStyles.inquiry.input}
            placeholderTextColor={colors.neutral[400]}
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
            autoFocus={!!reference} // ✅ auto-focus إذا كان فيه reference
          />
          
          <TouchableOpacity 
            onPress={handleSubmit}
            style={componentStyles.inquiry.searchButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="search" size={20} color="#fff" />
                <Text style={componentStyles.inquiry.searchButtonText}>استعلام</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Results */}
        {transferData && (
          <View style={componentStyles.inquiry.results}>
            <TransferStatus data={transferData} />
            
            <DocumentList 
              documents={documents}
              onDocumentPress={openDocument}
            />
          </View>
        )}

        {/* Empty State */}
        {!transferData && !loading && reference && (
          <View style={componentStyles.inquiry.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.neutral[300]} />
            <Text style={componentStyles.inquiry.emptyStateTitle}>
              لا توجد نتائج
            </Text>
            <Text style={componentStyles.inquiry.emptyStateText}>
              لم يتم العثور على معاملة بالمرجع: {reference}
            </Text>
          </View>
        )}

        {!transferData && !loading && !reference && (
          <View style={componentStyles.inquiry.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.neutral[300]} />
            <Text style={componentStyles.inquiry.emptyStateTitle}>
              ادخل المرجع للاستعلام
            </Text>
            <Text style={componentStyles.inquiry.emptyStateText}>
              أدخل رقم المرجع الخاص بالمعاملة لمشاهدة حالتها والمستندات المتاحة
            </Text>
          </View>
        )}

        {/* Loading State */}
        {loading && (
          <View style={componentStyles.inquiry.emptyState}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={componentStyles.inquiry.emptyStateTitle}>
              جاري البحث...
            </Text>
            <Text style={componentStyles.inquiry.emptyStateText}>
              يتم الآن البحث عن المعاملة بالمرجع: {reference}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}