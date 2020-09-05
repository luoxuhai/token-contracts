// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

/**
 * @title ERC20 interface
 * @dev see https://eips.ethereum.org/EIPS/eip-20
 */
interface IERC20 {
    /**
     * @dev Transfer token for a specified address
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Transfer tokens from one address to another
     * @param from address The address which you want to send tokens from
     * @param to address The address which you want to transfer to
     * @param value uint256 the amount of tokens to be transferred
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    /**
     * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
     * Beware that changing an allowance with this method brings the risk that someone may use both the old
     * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
     * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     */
    function approve(address spender, uint256 value)
        external
        returns (bool success);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {
    function safeMul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function safeDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b > 0);
        uint256 c = a / b;
        assert(a == b * c + (a % b));
        return c;
    }

    function safeSub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function safeAdd(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a && c >= b);
        return c;
    }
}

contract Token is IERC20 {
    using SafeMath for uint256;

    string public name;
    string public symbol;
    uint8 public decimals = 18; // 18是建议值
    uint256 public totalSupply;
    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 initialSupply,
        address tokenOwner,
        uint8 tokenDecimals
    ) {
        name = tokenName;
        symbol = tokenSymbol;
        totalSupply = initialSupply * 10**uint256(decimals);
        if (tokenDecimals != 0) decimals = tokenDecimals;
        owner = tokenOwner;
        balanceOf[owner] = totalSupply;
    }

    function transfer(address to, uint256 value)
        public
        override
        returns (bool)
    {
        require(value <= balanceOf[msg.sender]);
        require(to != address(0));

        balanceOf[msg.sender] = balanceOf[msg.sender].safeSub(value);
        balanceOf[to] = balanceOf[to].safeAdd(value);
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override returns (bool) {
        require(value <= balanceOf[from]);
        require(value <= allowance[from][msg.sender]);
        require(to != address(0));

        balanceOf[from] = balanceOf[from].safeSub(value);
        balanceOf[to] = balanceOf[to].safeAdd(value);
        allowance[from][msg.sender] = allowance[from][msg.sender].safeSub(
            value
        );
        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value)
        public
        override
        returns (bool)
    {
        require(spender != address(0));

        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
}