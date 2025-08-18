// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Prescription {
    enum PrescriptionStatus {
        Null,       // 등록 전
        Registered, // 등록 완료
        Used        // 사용 완료
    }

    struct PrescriptionInfo {
        uint prescribeDate; // 처방일시
        uint prepareDate; // 제조일시
        uint endDate; // 만료일시
        PrescriptionStatus status;
        string hospital;
        string pharmacy;
    }

    mapping(bytes32 => PrescriptionInfo) private _prescriptionInfos;

    event LogRegisterPrescription(bytes32 prescriptionHash);

    event LogUsePrescription(bytes32 prescriptionHash);

    constructor() {}

    function RegisterPrescription(bytes32 prescriptionHash, uint prescribeDate, uint endDate, string calldata hospital) public returns (bool) {
        require(_prescriptionInfos[prescriptionHash].status == PrescriptionStatus.Null, "Cannot register same hash.");
        require(block.timestamp <= endDate, "Cannot register end prescription.");

        _prescriptionInfos[prescriptionHash].prescribeDate = prescribeDate;
        _prescriptionInfos[prescriptionHash].endDate = endDate;
        _prescriptionInfos[prescriptionHash].status = PrescriptionStatus.Registered;
        _prescriptionInfos[prescriptionHash].hospital = hospital;

        emit LogRegisterPrescription(prescriptionHash);

        return true;
    }


    function UsePrescription(bytes32 prescriptionHash, uint prepareDate, string calldata pharmacy) public returns (bool) {
        PrescriptionInfo memory prescription = _prescriptionInfos[prescriptionHash];
        require(prescription.status == PrescriptionStatus.Registered, "Prescription does not registered or already used.");
        require(block.timestamp >= prescription.prescribeDate, "Prescription does not prescribe.");
        require(block.timestamp <= prescription.endDate, "Prescription expired.");

        _prescriptionInfos[prescriptionHash].prepareDate = prepareDate;
        _prescriptionInfos[prescriptionHash].status = PrescriptionStatus.Used;
        _prescriptionInfos[prescriptionHash].pharmacy = pharmacy;

        emit LogUsePrescription(prescriptionHash);
        return true;
    }

    function GetPrescriptionInfo(bytes32 prescriptionHash) public view returns (PrescriptionInfo memory prescription) {
        prescription = _prescriptionInfos[prescriptionHash];
        return prescription;
    }
}
