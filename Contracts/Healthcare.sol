// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Healthcare {
    enum HealthcareStatus {
        Null,       // 등록 전
        Registered, // 등록 완료
        Deleted     // 데이터 삭제
    }
    
    enum HealthcareType {
       healthcareData,   // 건강데이터
       healthcareReport, // 건강보고서
       dataToHospital,   // 측정기록병원전송
       reportToHospital  // 보고서병원전송
    }

    struct HealthcareInfo {
        uint registeredDate; // 등록일시
        uint deletedDate;    // 삭제일시 (옵셔널)
        string phoneNumber;  // 휴대폰번호
        string hospital;     // 전송한병원명 (옵셔널)
        HealthcareStatus status;
        HealthcareType healthcareType;
    }

    mapping(bytes32 => HealthcareInfo) private _healthcareInfos;

    event LogRegisterHealthcare(bytes32 healthcareHash);
    event LogDeleteHealthcare(bytes32 healthcareHash);

    constructor() {}

    function RegisterHealthcare(
        bytes32 healthcareHash, 
        string calldata phoneNumber, 
        HealthcareType healthcareType, 
        string calldata hospital
    ) public returns (bool) {
        require(_healthcareInfos[healthcareHash].status == HealthcareStatus.Null, "Cannot register same hash.");

        _healthcareInfos[healthcareHash].registeredDate = block.timestamp;
        _healthcareInfos[healthcareHash].phoneNumber = phoneNumber;
        _healthcareInfos[healthcareHash].healthcareType = healthcareType;
        _healthcareInfos[healthcareHash].hospital = hospital;
        _healthcareInfos[healthcareHash].status = HealthcareStatus.Registered;

        emit LogRegisterHealthcare(healthcareHash);

        return true;
    }

    function DeleteHealthcare(bytes32 healthcareHash) public returns (bool) {
        HealthcareInfo memory healthcare = _healthcareInfos[healthcareHash];
        require(healthcare.status == HealthcareStatus.Registered, "Healthcare data does not exist or already deleted.");

        _healthcareInfos[healthcareHash].deletedDate = block.timestamp;
        _healthcareInfos[healthcareHash].status = HealthcareStatus.Deleted;

        emit LogDeleteHealthcare(healthcareHash);
        return true;
    }

    function GetHealthcareInfo(bytes32 healthcareHash) public view returns (HealthcareInfo memory healthcare) {
        healthcare = _healthcareInfos[healthcareHash];
        return healthcare;
    }
}
