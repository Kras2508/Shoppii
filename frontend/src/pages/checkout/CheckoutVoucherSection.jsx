import React from 'react';

const CheckoutVoucherSection = ({
  selectedVoucher,
  voucherCode,
  setVoucherCode,
  showVoucherDropdown,
  setShowVoucherDropdown,
  availableVouchers,
  subtotal,
  onApplyVoucher,
  onRemoveVoucher,
  styles,
  formatPrice
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>
        <span>🎟️</span> Mã Giảm Giá
      </h2>
      {selectedVoucher ? (
        <div style={styles.voucherApplied}>
          <span>✓</span>
          <span style={{ flex: 1 }}>
            {selectedVoucher.code} - Giảm {
              selectedVoucher.discount_type === 'Percentage' 
                ? `${selectedVoucher.discount_value}%` 
                : formatPrice(selectedVoucher.discount_value)
            }
          </span>
          <button
            style={styles.removeVoucher}
            onClick={onRemoveVoucher}
          >
            ✕
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <div style={styles.voucherRow}>
            <input
              type="text"
              placeholder="Nhập mã voucher"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              onFocus={() => setShowVoucherDropdown(true)}
              style={styles.voucherInput}
            />
            <button
              style={styles.voucherBtn}
              onClick={onApplyVoucher}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
            >
              Áp dụng
            </button>
          </div>
          
          {/* Voucher Dropdown */}
          {showVoucherDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 100,
              marginTop: '4px',
              maxHeight: '250px',
              overflowY: 'auto'
            }}>
              <div style={{
                padding: '10px 12px',
                fontSize: '12px',
                color: '#758173',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Voucher có sẵn</span>
                <button
                  onClick={() => setShowVoucherDropdown(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#999'
                  }}
                >
                  ✕
                </button>
              </div>
              {availableVouchers
                .filter(v => v.status === 'Active' && v.used_count < v.usage_limit)
                .map(voucher => {
                  const isEligible = subtotal >= voucher.min_order_value;
                  return (
                    <div
                      key={voucher.voucher_id}
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid #f5f5f5',
                        cursor: isEligible ? 'pointer' : 'not-allowed',
                        opacity: isEligible ? 1 : 0.5,
                        transition: 'background 0.2s',
                        backgroundColor: 'white'
                      }}
                      onClick={() => {
                        if (isEligible) {
                          setVoucherCode(voucher.code);
                          onApplyVoucher(voucher);
                          setShowVoucherDropdown(false);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (isEligible) e.currentTarget.style.backgroundColor = '#f9fff9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{
                          backgroundColor: '#647A67',
                          color: 'white',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {voucher.discount_type === 'Percentage' 
                            ? `-${voucher.discount_value}%` 
                            : `-${(voucher.discount_value/1000)}K`}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#1F241F',
                            marginBottom: '2px'
                          }}>
                            {voucher.code}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#758173'
                          }}>
                            Đơn tối thiểu {formatPrice(voucher.min_order_value)}
                          </div>
                        </div>
                        {isEligible ? (
                          <span style={{ color: '#647A67', fontSize: '12px' }}>Dùng ngay</span>
                        ) : (
                          <span style={{ color: '#999', fontSize: '11px' }}>Chưa đủ điều kiện</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutVoucherSection;
