<script setup lang="ts">
  import { EventLog } from '@ebp/core';
  import { usePaymentItemStore } from '@/entities/payment-orders-item';

  const paymentOrderItemStore = usePaymentItemStore();
  const { getEventLogData } = paymentOrderItemStore;
</script>

<template>
  <EventLog :getData="getEventLogData" />
</template>
